'use client';

import { useEffect, useState } from 'react';

const KICKOFF = new Date('2027-05-27T09:00:00+01:00').getTime();

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return [Math.floor(s / 86400), Math.floor((s % 86400) / 3600), Math.floor((s % 3600) / 60), s % 60];
}

/** Server renders placeholders of fixed width (no layout shift); the client fills them in. */
export default function Countdown({ labels, aria }: { labels: string[]; aria: string }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="cd" role="timer" aria-label={aria}>
      {parts(now === null ? 0 : KICKOFF - now).map((v, i) => (
        <div key={labels[i]} className="cd__cell">
          <span className="cd__num">{now === null ? '--' : String(v).padStart(2, '0')}</span>
          <span className="cd__lbl">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}
