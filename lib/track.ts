import { META_PIXEL_ID, META_PIXEL_ID_I7CM } from '@/lib/config';

type W = Window & {
  gtag?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
};

const KEY = 'ic7m_booking_tracked';

/**
 * Booking conversion, sent once per visitor session whichever signal comes first:
 * the booking widget's confirmation message (landing page) or the /thank-you page.
 * Waits for the lazily-loaded tags; Meta "Schedule" goes to both pixels.
 */
export function trackBookingOnce(source: string): () => void {
  try {
    if (sessionStorage.getItem(KEY)) return () => {};
    sessionStorage.setItem(KEY, source);
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
      w.fbq('trackSingle', META_PIXEL_ID, 'Schedule');
      w.fbq('trackSingle', META_PIXEL_ID_I7CM, 'Schedule');
      sentMeta = true;
    }
    if ((sentGa && sentMeta) || tries > 60) window.clearInterval(id);
  }, 500);
  return () => window.clearInterval(id);
}

/** True when a postMessage from the booking widget reports a confirmed appointment. */
export function isBookingConfirmedMessage(e: MessageEvent): boolean {
  if (!/clientx\.ai|leadconnectorhq\.com|msgsndr\.com/.test(e.origin)) return false;
  let raw: string;
  try {
    raw = typeof e.data === 'string' ? e.data : JSON.stringify(e.data);
  } catch {
    return false;
  }
  return /(booking|appointment|calendar)/i.test(raw) && /(success|complete|booked|confirm|scheduled)/i.test(raw);
}
