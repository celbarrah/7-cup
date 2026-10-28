'use client';

import { useEffect } from 'react';

type W = Window & {
  gtag?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
  lintrk?: (...args: unknown[]) => void;
};

/**
 * Runs on the thank-you page:
 *  1. If the booking widget redirected *inside its iframe*, lift the page out to the full window.
 *  2. Fire the booking conversion once per session (GA4 + Meta Pixel), waiting for the
 *     lazily-loaded tags to be ready.
 */
export default function BookingConfirmed() {
  useEffect(() => {
    try {
      if (window.top && window.top !== window.self) {
        window.top.location.href = window.location.href;
        return;
      }
    } catch {
      /* cross-origin parent — stay put */
    }

    const KEY = 'ic7m_booking_tracked';
    try {
      if (sessionStorage.getItem(KEY)) return;
    } catch {}

    const w = window as W;
    let sentGa = false;
    let sentMeta = false;
    let tries = 0;
    const id = window.setInterval(() => {
      tries += 1;
      if (!sentGa && w.gtag) {
        w.gtag('event', 'generate_lead', { method: 'booking_call' });
        sentGa = true;
      }
      if (!sentMeta && w.fbq) {
        w.fbq('track', 'Schedule');
        sentMeta = true;
      }
      if ((sentGa && sentMeta) || tries > 60) {
        window.clearInterval(id);
        try {
          if (sentGa || sentMeta) sessionStorage.setItem(KEY, '1');
        } catch {}
      }
    }, 500);
    return () => window.clearInterval(id);
  }, []);

  return null;
}
