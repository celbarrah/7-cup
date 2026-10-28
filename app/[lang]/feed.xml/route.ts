import { CONTENT_UPDATED, SITE_NAME, SITE_URL } from '@/lib/config';
import { LOCALES, getDict, isLang } from '@/lib/i18n';

export const dynamic = 'force-static';
export const dynamicParams = false;
export const generateStaticParams = () => LOCALES.map((lang) => ({ lang }));

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** RSS 2.0 feed per language — one item per key section of the event page. */
export async function GET(_req: Request, { params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) return new Response('Not found', { status: 404 });
  const t = getDict(lang);
  const page = `${SITE_URL}/${lang}`;
  const pubDate = new Date(CONTENT_UPDATED).toUTCString();
  const image = `${SITE_URL}/og/og-${lang}.jpg`;

  const items = [
    { id: '', title: `${t.hero.title1} ${t.hero.title2}`, desc: `${t.hero.subPre}${t.hero.subStrong}${t.hero.subPost}` },
    { id: '#experience', title: `${t.experience.title}${t.experience.titleEm}`, desc: t.experience.lead },
    { id: '#proof', title: `${t.proof.title}${t.proof.titleEm}`, desc: t.proof.lead },
    { id: '#book', title: `${t.book.title}${t.book.titleEm}`, desc: `${t.book.lead} ${t.book.list.join(' · ')}` },
    { id: '#program', title: `${t.program.title}${t.program.titleEm}`, desc: t.program.days.map((d) => `${d.date}: ${d.title}`).join(' · ') },
    { id: '#faq', title: t.faq.items[0].q, desc: t.faq.items[0].a },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${esc(SITE_NAME)}</title>
    <link>${page}</link>
    <description>${esc(t.meta.description)}</description>
    <language>${lang === 'fr' ? 'fr-FR' : 'en-US'}</language>
    <lastBuildDate>${pubDate}</lastBuildDate>
    <atom:link href="${page}/feed.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${SITE_URL}/icons/icon-192.png</url>
      <title>${esc(SITE_NAME)}</title>
      <link>${page}</link>
    </image>
${items
  .map(
    (it) => `    <item>
      <title>${esc(it.title)}</title>
      <link>${page}${it.id}</link>
      <guid isPermaLink="true">${page}${it.id}</guid>
      <description>${esc(it.desc)}</description>
      <pubDate>${pubDate}</pubDate>
      <media:content url="${image}" medium="image" type="image/jpeg" width="1200" height="630" />
    </item>`,
  )
  .join('\n')}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
