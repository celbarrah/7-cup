# 7-cup

Landing page for the **International 7 Cup 2027** (Grand Stadium of Marrakech) — built with Next.js 15 (App Router), French and English.

```bash
npm install
npm run dev     # http://localhost:3000  →  redirects to /fr
npm run build && npm start
```

## Deploy (Vercel)

1. vercel.com → **Add New → Project** → import `celbarrah/7-cup`. Framework is auto-detected (Next.js); keep the default build settings.
2. **Settings → Domains** → add `info.ic7m.com`, then create the DNS record Vercel shows at your DNS provider (a `CNAME` for `info` pointing to Vercel).

Every push to `main` deploys to production; other branches get preview URLs.

## Routes

| URL | What |
| --- | --- |
| `/` | redirects to `/fr` |
| `/fr`, `/en` | landing page |
| `/thank-you` | post-booking redirect — sends the visitor to `/fr/thank-you` or `/en/thank-you` based on the language they booked in |
| `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest` | generated from `app/sitemap.ts`, `app/robots.ts`, `app/manifest.ts` |
| `/feed.xml` → `/fr/feed.xml`, `/en/feed.xml` | RSS 2.0 feeds |

**Booking calendar setting:** in the calendar's confirmation settings, set *Redirect to URL* to `https://info.ic7m.com/thank-you`.

## Where things live

- `lib/i18n.ts` — **all copy, FR + EN** (edit text here)
- `app/[lang]/page.tsx` — landing page sections
- `app/[lang]/thank-you/page.tsx` — confirmation page (fires the GA4 `generate_lead` + Meta `Schedule` conversions)
- `app/globals.css` — design system (glass, honeycomb, orange glow)
- `lib/config.ts` — site URL, booking calendar, Mux video, tracking IDs, contact details
- `lib/seo.ts` — schema.org JSON-LD graph (Organization, WebSite, WebPage, SportsEvent + Offer, FAQPage)
- `public/og/` — 1200×630 social share images (FR/EN)

## Performance choices

- Pages are statically prerendered; CSS is inlined (no render-blocking stylesheet); fonts self-hosted via `next/font` (2 display files only).
- Hero video (Mux HLS): desktop streams after load + idle; phones wait for the first scroll/touch.
- Testimonial videos are click-to-play — zero video bytes until clicked. `hls.js` is loaded on demand (full build: Mux serves audio as a separate track).
- Booking calendar loads on intent (CTA hover/tap), proximity, or shortly after the first interaction.
- GA4 / Meta Pixel / LinkedIn load on first interaction (5s fallback) so they never compete with the first render.
- Off-screen sections use `content-visibility: auto`; costly continuous effects are disabled on phones.

Lighthouse (production build): mobile ~90 performance, 100 accessibility / best practices / SEO; desktop 99 performance.
