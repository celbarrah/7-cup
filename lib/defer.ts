const EVENTS = ['pointerdown', 'keydown', 'touchstart', 'scroll', 'wheel'] as const;

/**
 * Run `fn` once, on the visitor's first real interaction (or after `fallbackMs`, if given).
 * Used to keep non-essential third-party work (tracking, decorative video, the booking
 * widget) out of the initial page load, so the page becomes interactive faster.
 */
export function onFirstInteraction(fn: () => void, fallbackMs?: number): () => void {
  let done = false;
  let timer: number | undefined;
  const run = () => {
    if (done) return;
    done = true;
    cleanup();
    fn();
  };
  const cleanup = () => {
    EVENTS.forEach((e) => window.removeEventListener(e, run, { capture: true }));
    window.clearTimeout(timer);
  };
  EVENTS.forEach((e) => window.addEventListener(e, run, { once: true, passive: true, capture: true }));
  if (fallbackMs !== undefined) timer = window.setTimeout(run, fallbackMs);
  return cleanup;
}
