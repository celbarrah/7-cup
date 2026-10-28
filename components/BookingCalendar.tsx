'use client';

import { useEffect, useRef, useState } from 'react';
import { afterLoad } from '@/lib/hls';
import { onFirstInteraction } from '@/lib/defer';
import { BOOKING_EMBED_JS, BOOKING_ID, BOOKING_URL } from '@/lib/config';

/**
 * The calendar iframe is mounted as early as possible without hurting first paint:
 *  - warmed up ~1.5s after the visitor first scrolls/taps (engaged visitors only), or
 *  - immediately when a "Book" CTA is hovered/touched/focused, or
 *  - when the booking section comes within ~1500px of the viewport.
 * So by the time a visitor lands on #book, the calendar is already there.
 */
export default function BookingCalendar({ title, openLabel }: { title: string; openLabel: string }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (mounted) return;
    const mount = () => setMounted(true);

    const io = new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && mount(), {
      rootMargin: '1500px 0px',
    });
    if (boxRef.current) io.observe(boxRef.current);

    const onIntent = (e: Event) => {
      if ((e.target as Element | null)?.closest?.('a[href="#book"]')) mount();
    };
    const opts = { passive: true, capture: true } as const;
    document.addEventListener('pointerover', onIntent, opts);
    document.addEventListener('touchstart', onIntent, opts);
    document.addEventListener('focusin', onIntent, opts);

    let stopIdle = () => {};
    const stopInteraction = onFirstInteraction(() => (stopIdle = afterLoad(mount, 1500)));
    const stopWaiting = () => {
      stopInteraction();
      stopIdle();
    };

    return () => {
      io.disconnect();
      document.removeEventListener('pointerover', onIntent, opts);
      document.removeEventListener('touchstart', onIntent, opts);
      document.removeEventListener('focusin', onIntent, opts);
      stopWaiting();
    };
  }, [mounted]);

  // Auto-height helper from the booking provider, loaded only with the iframe
  useEffect(() => {
    if (!mounted || document.querySelector(`script[src="${BOOKING_EMBED_JS}"]`)) return;
    const s = document.createElement('script');
    s.src = BOOKING_EMBED_JS;
    s.async = true;
    document.body.appendChild(s);
  }, [mounted]);

  return (
    <div ref={boxRef} className={`cal${ready ? ' is-ready' : ''}`}>
      {!ready && (
        <div className="cal__skeleton" aria-hidden="true">
          <div className="cal__sk-head" />
          <div className="cal__sk-grid">
            {Array.from({ length: 35 }, (_, i) => (
              <span key={i} />
            ))}
          </div>
          <div className="cal__sk-slots">
            <span />
            <span />
            <span />
          </div>
        </div>
      )}
      {mounted && (
        <iframe
          src={BOOKING_URL}
          id={`${BOOKING_ID}_booking`}
          title={title}
          className="cal__frame"
          onLoad={() => setReady(true)}
        />
      )}
      <noscript>
        <a className="btn btn--primary" href={BOOKING_URL}>
          {openLabel}
        </a>
      </noscript>
    </div>
  );
}
