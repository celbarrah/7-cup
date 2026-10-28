'use client';

import { useEffect } from 'react';

/** Feeds the cursor position to CSS so the honeycomb lights up around it (desktop only). */
export default function HexSpotlight() {
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const root = document.documentElement;
    let frame = 0;
    let x = 0;
    let y = 0;
    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        root.style.setProperty('--mx', `${x}px`);
        root.style.setProperty('--my', `${y}px`);
      });
    };
    root.classList.add('has-spotlight');
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(frame);
      root.classList.remove('has-spotlight');
    };
  }, []);

  return <div className="hex-spotlight" aria-hidden="true" />;
}
