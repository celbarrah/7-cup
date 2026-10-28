'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { attachHls, preloadHls } from '@/lib/hls';
import { muxSrc } from '@/lib/config';
import { fill, type Dict } from '@/lib/i18n';

type Labels = Dict['video'];

export type Testimonial = {
  playbackId: string;
  poster: string;
  tag: string;
  quote: string;
  name: string;
  role: string;
};

/** Reels-style cards; clicking opens a cinematic lightbox. No video bytes load until then. */
export default function Testimonials({
  items,
  labels,
  bookHref = '#book',
}: {
  items: Testimonial[];
  labels: Labels;
  bookHref?: string;
}) {
  const [open, setOpen] = useState<Testimonial | null>(null);
  const close = useCallback(() => setOpen(null), []);

  return (
    <>
      <div className="reels">
        {items.map((t, i) => (
          <button
            key={t.playbackId}
            type="button"
            className={`reel reveal${i === 0 ? ' reel--lead' : ''}`}
            onClick={() => setOpen(t)}
            onPointerEnter={preloadHls}
            onFocus={preloadHls}
          >
            {/* visible text stays the accessible name; this just adds the action */}
            <span className="sr-only">{fill(labels.play, { name: t.name })}</span>
            <Image src={t.poster} alt="" fill sizes="(max-width: 700px) 80vw, 340px" className="reel__img" />
            <span className="reel__shade" aria-hidden="true" />
            <span className="reel__tag">{t.tag}</span>
            <span className="reel__play" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="26" height="26">
                <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
              </svg>
            </span>
            <span className="reel__cap">
              <span className="reel__quote">“{t.quote}”</span>
              <span className="reel__who">
                <strong>{t.name}</strong>
                <small>{t.role}</small>
              </span>
            </span>
          </button>
        ))}
      </div>
      {/* Portal to <body> so the lightbox sits above the nav and floating CTA */}
      {open && createPortal(<Lightbox item={open} onClose={close} labels={labels} bookHref={bookHref} />, document.body)}
    </>
  );
}

function Lightbox({
  item,
  onClose,
  labels,
  bookHref,
}: {
  item: Testimonial;
  onClose: () => void;
  labels: Labels;
  bookHref: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let cleanup = () => {};
    let cancelled = false;
    attachHls(video, muxSrc(item.playbackId)).then((destroy) => {
      if (cancelled) return destroy();
      cleanup = destroy;
      video.play().catch(() => {});
    });
    return () => {
      cancelled = true;
      cleanup();
    };
  }, [item.playbackId]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    closeRef.current?.focus();
    return () => {
      document.documentElement.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={fill(labels.dialog, { name: item.name })} onClick={onClose}>
      <div className="lightbox__panel glass" onClick={(e) => e.stopPropagation()}>
        <button ref={closeRef} type="button" className="lightbox__close" onClick={onClose} aria-label={labels.close}>
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <video ref={videoRef} className="lightbox__video" controls playsInline poster={item.poster} />
        <div className="lightbox__cap">
          <p className="lightbox__quote">“{item.quote}”</p>
          <p>
            <strong>{item.name}</strong> · <span>{item.role}</span>
          </p>
          <a href={bookHref} className="btn btn--primary btn--sm" onClick={onClose}>
            <span>{labels.cta}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
