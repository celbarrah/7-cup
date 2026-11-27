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
let running = false;

export function trackBookingOnce(source: string): () => void {
  // The session flag is written only AFTER the event is really sent: the widget confirmation
  // is immediately followed by the redirect to /thank-you, which must still be able to send it
  // if the page was left before the tags were ready.
  try {
    if (sessionStorage.getItem(KEY) || running) return () => {};
  } catch {
    if (running) return () => {};
  }
  running = true;

  const w = window as W;
  let sentGa = false;
  let sentMeta = false;
  let tries = 0;
  const send = () => {
    tries += 1;
    if (!sentGa && w.gtag) {
      w.gtag('event', 'generate_lead', { method: 'booking_call' });
      sentGa = true;
    }
    if (!sentMeta && w.fbq) {
      w.fbq('trackSingle', META_PIXEL_ID, 'Schedule');
      w.fbq('trackSingle', META_PIXEL_ID_I7CM, 'Schedule');
      sentMeta = true;
      try {
        sessionStorage.setItem(KEY, source);
      } catch {}
    }
    if ((sentGa && sentMeta) || tries > 120) {
      window.clearInterval(id);
      running = false;
    }
  };
  const id = window.setInterval(send, 250);
  send();
  return () => {
    window.clearInterval(id);
    running = false;
  };
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
