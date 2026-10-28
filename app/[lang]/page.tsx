import Image from 'next/image';
import { notFound } from 'next/navigation';
import HeroVideo from '@/components/HeroVideo';
import Testimonials from '@/components/Testimonials';
import BookingCalendar from '@/components/BookingCalendar';
import HexSpotlight from '@/components/HexSpotlight';
import FloatingCTA from '@/components/FloatingCTA';
import Countdown from '@/components/Countdown';
import LangSwitch from '@/components/LangSwitch';
import { CONTACT } from '@/lib/config';
import { getDict, isLang } from '@/lib/i18n';
import { getTestimonials } from '@/lib/testimonials';
import { buildJsonLd } from '@/lib/seo';
import stadium from '@/public/images/stade-hero.webp';
import tunnel from '@/public/images/167A1680.webp';
import squad from '@/public/images/167A1640.webp';
import action from '@/public/images/167A1764.webp';
import women from '@/public/images/167A1697.webp';
import bus from '@/public/images/167A1654.webp';
import logo from '@/public/images/logo.webp';

const LOGOS = [
  ['royal-air-maroc-logo', 'Royal Air Maroc'],
  ['deloitte-logo', 'Deloitte'],
  ['cocacola-logo', 'Coca-Cola'],
  ['pwc-logo', 'PwC'],
  ['dhl-logo', 'DHL'],
  ['Maroc-telecom-logo', 'Maroc Telecom'],
  ['bank-africa-logo', 'Bank of Africa'],
  ['dassault-aviation-logo', 'Dassault Aviation'],
  ['bmci-logo', 'BMCI'],
  ['bel-logo', 'Bel'],
  ['pizza-hut-logo', 'Pizza Hut'],
  ['dislog-logo', 'Dislog'],
  ['arthur-martin_logo', 'Arthur Martin'],
  ['lefive-logo', 'Le Five'],
] as const;

// Icons for the Cohesion / Motivation / Retention rows (same order as dict.why.rows)
const WHY_ICONS = [
  'M16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 2c-2.7 0-6 1.3-6 3.5V19h12v-2.5C14 14.3 10.7 13 8 13Zm8 0c-.4 0-.8 0-1.3.1 1.4.9 2.3 2 2.3 3.4V19h5v-2.5c0-2.2-3.3-3.5-6-3.5Z',
  'M13.5 2.5S14.3 5.4 14.3 7.7c0 2.2-1.4 4-3.6 4-2.2 0-3.9-1.8-3.9-4l.1-.4C4.8 9.7 3.5 12.6 3.5 15.8a8.5 8.5 0 0 0 17 0c0-5.4-2.6-10.2-7-13.3ZM11.7 19c-1.6 0-2.8-1.3-2.8-2.8 0-1.5.9-2.5 2.6-2.8 1.7-.4 3.4-1.2 4.4-2.5.4 1.2.6 2.5.6 3.9 0 2.3-2.1 4.2-4.8 4.2Z',
  'M12 2 4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5l-8-3Zm-1.2 14.2-3.5-3.5 1.4-1.4 2.1 2.1 4.9-4.9 1.4 1.4-6.3 6.3Z',
];

const HIGHLIGHT_DAY = 2;

function Hex({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 1.5 21.1 6.75v10.5L12 22.5 2.9 17.25V6.75z" />
    </svg>
  );
}

function Check() {
  return (
    <svg className="ico-check" viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="10" cy="10" r="9" />
      <path d="m6.3 10.2 2.4 2.4 5-5" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Arrow() {
  return (
    <svg className="ico-arrow" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4 10h11m-4.5-4.5L15 10l-4.5 4.5" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BookButton({ label, big = false }: { label: string; big?: boolean }) {
  return (
    <a href="#book" className={`btn btn--primary${big ? ' btn--big' : ''}`}>
      <span>{label}</span>
      <span className="btn__arrow">
        <Arrow />
      </span>
    </a>
  );
}

function SectionHead({ eyebrow, children, lead, center }: { eyebrow: string; children: React.ReactNode; lead?: React.ReactNode; center?: boolean }) {
  return (
    <div className={`head reveal${center ? ' head--center' : ''}`}>
      <p className="pill">{eyebrow}</p>
      <h2>{children}</h2>
      {lead && <p className="lead">{lead}</p>}
    </div>
  );
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = getDict(lang);

  const jsonLd = buildJsonLd(lang, t);

  return (
    <>
      <HexSpotlight />

      {/* ───────── NAV (floating glass pill) ───────── */}
      <header className="nav">
        <div className="nav__pill glass">
          <a href="#top" className="nav__brand">
            <Image src={logo} alt="" width={50} height={44} priority />
            <span>
              International 7 Cup
              <small>{t.nav.sub}</small>
            </span>
          </a>
          <nav className="nav__links" aria-label={t.nav.sections}>
            <a href="#experience">{t.nav.experience}</a>
            <a href="#program">{t.nav.program}</a>
            <a href="#proof">{t.nav.testimonials}</a>
            <a href="#book">{t.nav.pricing}</a>
            <a href="#faq">{t.nav.faq}</a>
          </nav>
          <LangSwitch lang={lang} label={t.nav.language} />
          <a href="#book" className="btn btn--primary btn--sm nav__cta">
            <span>{t.nav.cta}</span>
          </a>
        </div>
      </header>

      <main id="top">
        {/* ───────── HERO ───────── */}
        <section className="hero">
          <div className="hero__media" aria-hidden="true">
            <Image src={stadium} alt="" fill priority fetchPriority="high" placeholder="blur" sizes="100vw" className="hero__img" />
            <HeroVideo />
            <div className="hero__shade" />
            <div className="hero__hex" />
          </div>

          <div className="wrap hero__grid">
            <div className="hero__copy">
              <p className="pill pill--live anim" style={{ ['--d' as string]: '0ms' }}>
                <span className="dot" /> {t.hero.chip}
              </p>
              <h1 className="hero__title anim" style={{ ['--d' as string]: '60ms' }}>
                {t.hero.title1}
                <br />
                <em>{t.hero.title2}</em>
              </h1>
              <p className="hero__sub anim" style={{ ['--d' as string]: '120ms' }}>
                {t.hero.subPre}
                <strong>{t.hero.subStrong}</strong>
                {t.hero.subPost}
              </p>
              <div className="hero__ctas anim" style={{ ['--d' as string]: '180ms' }}>
                <BookButton label={t.hero.ctaBook} big />
                <a href="#proof" className="btn btn--glass btn--big">
                  <span className="play-dot" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="12" height="12">
                      <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
                    </svg>
                  </span>
                  {t.hero.ctaWatch}
                </a>
              </div>
              <ul className="hero__trust anim" style={{ ['--d' as string]: '240ms' }}>
                {t.hero.trust.map(([n, l]) => (
                  <li key={l}>
                    <b>{n}</b> {l}
                  </li>
                ))}
              </ul>
            </div>

            <aside className="hero__card glass anim" style={{ ['--d' as string]: '200ms' }}>
              <div className="hero__card-top">
                <span className="pill pill--sm">{t.hero.cardLabel}</span>
                <span className="hero__spots">
                  <Hex className="hex-ico" /> {t.hero.spots}
                </span>
              </div>
              <Countdown labels={t.countdown.labels} aria={t.countdown.aria} />
              <div className="hero__card-row">
                <div>
                  <p className="hero__price">
                    {t.hero.price}
                    <small>{t.hero.perPlayer}</small>
                  </p>
                  <p className="hero__price-sub">{t.hero.priceSub}</p>
                </div>
                <a href="#book" className="circle-btn" aria-label={t.bookButton}>
                  <Arrow />
                </a>
              </div>
            </aside>
          </div>

          <div className="logos" aria-label={t.hero.logosAria}>
            <p className="logos__label">{t.hero.logosLabel}</p>
            <div className="logos__track">
              {[0, 1].map((dup) => (
                <ul key={dup} className="logos__list" aria-hidden={dup === 1 || undefined}>
                  {LOGOS.map(([file, name]) => (
                    <li key={file}>
                      <Image src={`/logos/${file}.webp`} alt={dup ? '' : name} width={120} height={120} sizes="120px" />
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </section>

        {/* ───────── EXPERIENCE ───────── */}
        <section id="experience" className="section">
          <div className="orb orb--r" aria-hidden="true" />
          <div className="wrap">
            <SectionHead eyebrow={t.experience.eyebrow} lead={t.experience.lead}>
              {t.experience.title}
              <em>{t.experience.titleEm}</em>
            </SectionHead>

            <div className="bento">
              <article className="tile tile--a reveal">
                <Image src={stadium} alt={t.experience.a.alt} fill quality={65} sizes="(max-width: 900px) 100vw, 60vw" />
                <div className="tile__txt">
                  <span className="pill pill--sm">{t.experience.a.tag}</span>
                  <h3>{t.experience.a.title}</h3>
                  <p>{t.experience.a.text}</p>
                </div>
              </article>
              <article className="tile tile--b reveal">
                <Image src={tunnel} alt={t.experience.b.alt} fill quality={60} sizes="(max-width: 900px) 100vw, 30vw" />
                <div className="tile__txt">
                  <span className="pill pill--sm">{t.experience.b.tag}</span>
                  <h3>{t.experience.b.title}</h3>
                </div>
              </article>
              <article className="tile tile--c tile--glass glass reveal">
                <div className="tile__orb" aria-hidden="true" />
                <span className="pill pill--sm">{t.experience.c.tag}</span>
                <h3>
                  {t.experience.c.pre}
                  <em>{t.experience.c.em}</em>
                  {t.experience.c.post}
                </h3>
                <p>{t.experience.c.text}</p>
              </article>
              {(
                [
                  ['d', action],
                  ['e', women],
                  ['f', squad],
                ] as const
              ).map(([k, img]) => (
                <article key={k} className={`tile tile--${k} reveal`}>
                  <Image src={img} alt={t.experience[k].alt} fill quality={60} sizes="(max-width: 900px) 100vw, 30vw" />
                  <div className="tile__txt">
                    <span className="pill pill--sm">{t.experience[k].tag}</span>
                    <h3>{t.experience[k].title}</h3>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ───────── PROOF ───────── */}
        <section id="proof" className="section">
          <div className="wrap">
            <SectionHead eyebrow={t.proof.eyebrow} lead={t.proof.lead} center>
              {t.proof.title}
              <em>{t.proof.titleEm}</em>
            </SectionHead>
            <Testimonials items={getTestimonials(t)} labels={t.video} />
          </div>
        </section>

        {/* ───────── PRICING + BOOKING ───────── */}
        <section id="book" className="section section--book">
          <div className="orb orb--c" aria-hidden="true" />
          <div className="wrap">
            <SectionHead eyebrow={t.book.eyebrow} lead={t.book.lead} center>
              {t.book.title}
              <em>{t.book.titleEm}</em>
            </SectionHead>

            <div className="book">
              <aside className="price glass reveal">
                <p className="pill pill--sm">{t.book.priceLabel}</p>
                <p className="price__amount">
                  {t.book.currencyFirst ? (
                    <>
                      <span>€</span>750
                    </>
                  ) : (
                    <>
                      750<span className="price__cur-after">€</span>
                    </>
                  )}
                </p>
                <p className="price__vat">{t.book.vat}</p>
                <ul className="price__list">
                  {t.book.list.map((x) => (
                    <li key={x}>
                      <Check />
                      {x}
                    </li>
                  ))}
                </ul>
                <div className="price__extra">
                  <p>
                    <span>{t.book.insurance}</span>
                    <strong>{t.book.insurancePrice}</strong>
                  </p>
                  <p>
                    <span>{t.book.single}</span>
                    <strong>{t.book.singlePrice}</strong>
                  </p>
                </div>
                <ol className="steps">
                  {t.book.steps.map((s, i) => (
                    <li key={s}>
                      <b>{i + 1}</b> {s}
                    </li>
                  ))}
                </ol>
              </aside>

              <div className="book__cal glass reveal">
                <div className="book__cal-head">
                  <span className="dot" /> {t.book.calHead}
                </div>
                <BookingCalendar title={t.calendar.title} openLabel={t.calendar.open} />
                <p className="book__alt">
                  {t.book.alt} <a href={CONTACT.phoneHref}>{CONTACT.phone}</a> ·{' '}
                  <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ───────── WHY (numbered glass rows) ───────── */}
        <section className="section section--why">
          <div className="planet" aria-hidden="true" />
          <div className="wrap why">
            <div className="why__intro reveal">
              <p className="pill">{t.why.eyebrow}</p>
              <h2>
                {t.why.title}
                <em>{t.why.titleEm}</em>
              </h2>
              <p className="lead">{t.why.lead}</p>
              <BookButton label={t.why.cta} />
            </div>
            <ol className="why__list">
              {t.why.rows.map((w, i) => (
                <li key={w.title} className="why__row glass reveal">
                  <span className="why__icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="24" height="24">
                      <path d={WHY_ICONS[i]} fill="currentColor" />
                    </svg>
                  </span>
                  <div className="why__txt">
                    <h3>{w.title}</h3>
                    <p>{w.sub}</p>
                    <p className="why__stat">
                      <b>{w.stat}</b> {w.statLbl}
                    </p>
                  </div>
                  <span className="why__num" aria-hidden="true">
                    0{i + 1}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ───────── PROGRAM ───────── */}
        <section id="program" className="section">
          <div className="orb orb--l" aria-hidden="true" />
          <div className="wrap">
            <SectionHead eyebrow={t.program.eyebrow} lead={t.program.lead}>
              {t.program.title}
              <em>{t.program.titleEm}</em>
            </SectionHead>

            <ol className="days">
              {t.program.days.map((d, i) => {
                const hi = i === HIGHLIGHT_DAY;
                return (
                  <li key={d.date} className={`day glass reveal${hi ? ' day--hi' : ''}`}>
                    <div className="day__top">
                      <span className="day__num">0{i + 1}</span>
                      {hi && <span className="pill pill--sm pill--solid">{t.program.highlight}</span>}
                    </div>
                    <p className="day__date">{d.date}</p>
                    <h3>{d.title}</h3>
                    <ul>
                      {d.items.map((it) => (
                        <li key={it}>{it}</li>
                      ))}
                    </ul>
                  </li>
                );
              })}
            </ol>

            <div className="format glass reveal">
              <div className="format__img">
                <Image src={bus} alt={t.program.formatAlt} fill quality={60} sizes="(max-width: 900px) 100vw, 360px" />
              </div>
              <dl className="format__specs">
                {t.program.format.map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* ───────── FAQ ───────── */}
        <section id="faq" className="section">
          <div className="wrap faq">
            <div className="faq__intro reveal">
              <p className="pill">{t.faq.eyebrow}</p>
              <h2>
                {t.faq.title}
                <em>{t.faq.titleEm}</em>
              </h2>
              <p className="lead">{t.faq.lead}</p>
              <div className="faq__contact glass">
                <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
                <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
              </div>
            </div>
            <div className="faq__list">
              {t.faq.items.map(({ q, a }, i) => (
                <details key={q} className="glass reveal" open={i === 0}>
                  <summary>
                    <span className="faq__n">0{i + 1}</span>
                    <span className="faq__q">{q}</span>
                    <span className="faq__icon" aria-hidden="true" />
                  </summary>
                  <p>{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ───────── FOOTER (with closing CTA) ───────── */}
      <footer className="foot">
        <div className="wrap">
          <div className="foot__cta glass reveal">
            <div className="foot__cta-orb" aria-hidden="true" />
            <div className="foot__cta-hex" aria-hidden="true" />
            <div className="foot__cta-txt">
              <p className="pill">{t.footer.pill}</p>
              <h2>
                {t.footer.title}
                <br />
                <em>{t.footer.titleEm}</em>
              </h2>
            </div>
            <BookButton label={t.footer.cta} big />
          </div>

          <div className="foot__grid">
            <div className="foot__brand">
              <Image src={logo} alt="International 7 Cup" width={52} height={46} />
              <p>
                <strong>International 7 Cup Marrakech</strong>
                {t.footer.tagline}
              </p>
              <div className="foot__social">
                <a href={CONTACT.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.4H8v3h2.6V21h2.9Z"
                    />
                  </svg>
                </a>
                <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M6.9 8.8H3.8V20h3.1V8.8ZM5.4 3.5a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6ZM20.2 13.6c0-3-1.6-5-4.3-5-1.5 0-2.5.8-2.9 1.6V8.8h-3V20h3.1v-5.6c0-1.5.3-2.9 2.1-2.9 1.8 0 1.9 1.7 1.9 3V20h3.1v-6.4Z"
                    />
                  </svg>
                </a>
                <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3Zm0 16.4c-1.4 0-2.8-.4-4-1.1l-.3-.2-2.7.7.7-2.6-.2-.3A7.4 7.4 0 1 1 12 19.4Zm4.1-5.5c-.2-.1-1.3-.7-1.5-.7-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1a6 6 0 0 1-3-2.6c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.7-1.6c-.2-.4-.4-.4-.5-.4h-.4c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.3c.1.2 1.6 2.5 4 3.5 1.5.6 2 .7 2.8.6.5-.1 1.3-.6 1.5-1.1.2-.5.2-1 .1-1.1l-.3-.2Z"
                    />
                  </svg>
                </a>
              </div>
            </div>
            <nav className="foot__col" aria-label={t.footer.nav}>
              <p className="foot__h">{t.footer.explore}</p>
              <a href="#experience">{t.footer.experience}</a>
              <a href="#program">{t.nav.program}</a>
              <a href="#proof">{t.nav.testimonials}</a>
              <a href="#book">{t.nav.pricing}</a>
              <a href="#faq">{t.nav.faq}</a>
            </nav>
            <div className="foot__col">
              <p className="foot__h">{t.footer.event}</p>
              {t.footer.eventLines.map((l) => (
                <p key={l}>{l}</p>
              ))}
            </div>
            <div className="foot__col">
              <p className="foot__h">{t.footer.contact}</p>
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
              <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
              <a href="#book" className="foot__book">
                {t.footer.bookLink}
              </a>
            </div>
          </div>

          <p className="foot__word" aria-hidden="true">
            7 CUP
          </p>

          <div className="foot__bottom">
            <p>{t.footer.rights}</p>
            <p>{t.footer.organised}</p>
          </div>
        </div>
      </footer>

      <FloatingCTA title={t.fab.title} sub={t.fab.sub} />

      <script
        type="application/ld+json"
        // escape "<" so content can never close the script tag
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
    </>
  );
}
