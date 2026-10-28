'use client';

import { useEffect } from 'react';
import { LOCALES, type Lang } from '@/lib/i18n';

/**
 * FR | EN toggle. Also remembers the visitor's language in a cookie, so the shared
 * booking redirect (/thank-you) can send them to the thank-you page in their language.
 */
export default function LangSwitch({ lang, path = '', label }: { lang: Lang; path?: string; label: string }) {
  useEffect(() => {
    document.cookie = `ic7m_lang=${lang}; path=/; max-age=31536000; SameSite=Lax`;
  }, [lang]);

  return (
    <nav className="lang" aria-label={label}>
      {LOCALES.map((l) => (
        <a key={l} href={`/${l}${path}`} hrefLang={l} lang={l} aria-current={l === lang ? 'true' : undefined}>
          {l.toUpperCase()}
        </a>
      ))}
    </nav>
  );
}
