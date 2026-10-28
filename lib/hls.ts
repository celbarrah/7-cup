type W = Window & { ManagedMediaSource?: unknown; MediaSource?: unknown };

/**
 * Attach an HLS stream to a <video>.
 * hls.js (full build: Mux serves audio as a separate track, which the light build can't play;
 * fetched on demand) is preferred wherever Media Source Extensions exist —
 * Chromium/Edge now answer "maybe" to canPlayType(HLS) but then fail to play, so that check
 * can't be trusted. Native HLS is only used where MSE is missing (older iPhones).
 * Returns a cleanup function.
 */
export async function attachHls(
  video: HTMLVideoElement,
  src: string,
  { lowStart = false, maxBufferLength = 12 }: { lowStart?: boolean; maxBufferLength?: number } = {},
): Promise<() => void> {
  const w = window as W;
  const hasMse = Boolean(w.MediaSource || w.ManagedMediaSource);

  if (!hasMse && video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = src;
    return () => {
      video.removeAttribute('src');
      video.load();
    };
  }

  const { default: Hls } = await import('hls.js');
  if (!Hls.isSupported()) {
    video.src = src; // last resort
    return () => video.removeAttribute('src');
  }

  const hls = new Hls({
    capLevelToPlayerSize: true,
    startLevel: lowStart ? 0 : -1,
    maxBufferLength,
    maxMaxBufferLength: maxBufferLength * 2,
    backBufferLength: 10,
  });
  hls.on(Hls.Events.ERROR, (_e, data) => {
    if (!data.fatal) return;
    if (data.type === Hls.ErrorTypes.NETWORK_ERROR) hls.startLoad();
    else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) hls.recoverMediaError();
  });
  hls.loadSource(src);
  hls.attachMedia(video);
  return () => hls.destroy();
}

/** Preload the player chunk (e.g. on hover) so playback starts instantly on click. */
export const preloadHls = () => void import('hls.js');

/** Skip autoplaying decorative video for data-saver users, slow links and reduced motion. */
export function canAutoplayDecor(): boolean {
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } })
    .connection;
  if (conn?.saveData || /(^|-)2g$/.test(conn?.effectiveType ?? '')) return false;
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Run `fn` once the page has fully loaded and the main thread is idle. */
export function afterLoad(fn: () => void, delay = 0): () => void {
  let timer: number | undefined;
  let idle: number | undefined;
  const run = () => {
    timer = window.setTimeout(() => {
      if ('requestIdleCallback' in window) idle = window.requestIdleCallback(fn, { timeout: 1500 });
      else fn();
    }, delay);
  };
  if (document.readyState === 'complete') run();
  else window.addEventListener('load', run, { once: true });
  return () => {
    window.removeEventListener('load', run);
    window.clearTimeout(timer);
    if (idle !== undefined) window.cancelIdleCallback(idle);
  };
}
