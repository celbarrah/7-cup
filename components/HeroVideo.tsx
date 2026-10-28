'use client';

import { useEffect, useRef, useState } from 'react';
import { afterLoad, attachHls, canAutoplayDecor } from '@/lib/hls';
import { onFirstInteraction } from '@/lib/defer';
import { MUX_HERO, muxSrc } from '@/lib/config';

/**
 * Background video layered over the (priority-loaded) hero image.
 * Desktop: streams once the page is loaded + idle. Phones: waits for the first scroll/touch,
 * so mobile visitors never pay megabytes of video before they engage.
 * Either way it cross-fades in once frames play and never competes with the first paint.
 */
export default function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video || !canAutoplayDecor()) return;

    let cleanup = () => {};
    let cancelled = false;
    const start = () => {
      attachHls(video, muxSrc(MUX_HERO), { lowStart: true, maxBufferLength: 6 }).then((destroy) => {
        if (cancelled) return destroy();
        cleanup = destroy;
        video.play().catch(() => {});
      });
    };
    const isDesktop = window.matchMedia('(min-width: 900px)').matches;
    let stopIdle = () => {};
    const stopInteraction = isDesktop ? () => {} : onFirstInteraction(() => (stopIdle = afterLoad(start)));
    if (isDesktop) stopIdle = afterLoad(start, 300);
    const stopWaiting = () => {
      stopInteraction();
      stopIdle();
    };

    // Pause when the hero is off-screen to save CPU/battery
    const io = new IntersectionObserver(([entry]) => {
      if (!video.src && !video.currentSrc) return;
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
    io.observe(video);

    return () => {
      cancelled = true;
      stopWaiting();
      io.disconnect();
      cleanup();
    };
  }, []);

  return (
    <video
      ref={ref}
      className={`hero__video${playing ? ' is-playing' : ''}`}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
      onPlaying={() => setPlaying(true)}
    />
  );
}
