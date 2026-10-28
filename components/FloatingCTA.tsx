'use client';

import { useEffect, useState } from 'react';

/**
 * Floating "Book now" hook — 250px pill bottom-right on desktop, full-width bar on mobile.
 * Shakes every few seconds; steps aside while the booking calendar itself is on screen.
 */
export default function FloatingCTA({ title, sub }: { title: string; sub: string }) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const target = document.getElementById('book');
    if (!target) return;
    const io = new IntersectionObserver(([e]) => setHidden(e.isIntersecting), { threshold: 0.15 });
    io.observe(target);
    return () => io.disconnect();
  }, []);

  return (
    <a href="#book" className={`fab${hidden ? ' is-hidden' : ''}`} aria-hidden={hidden || undefined} tabIndex={hidden ? -1 : 0}>
      <span className="fab__ring" aria-hidden="true" />
      <span className="fab__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="20" height="20">
          <rect x="3.5" y="5" width="17" height="15" rx="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="M3.5 10h17M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </span>
      <span className="fab__txt">
        <strong>{title}</strong>
        <small>{sub}</small>
      </span>
      <svg className="fab__arrow" viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
        <path d="M4 10h11m-4.5-4.5L15 10l-4.5 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
}
