import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Testimonials from '@/components/Testimonials';
import BookingConfirmed from '@/components/BookingConfirmed';
import LangSwitch from '@/components/LangSwitch';
import { CONTACT } from '@/lib/config';
import { getDict, isLang } from '@/lib/i18n';
import { getTestimonials } from '@/lib/testimonials';
import logo from '@/public/images/logo.webp';
import squad from '@/public/images/167A1640.webp';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const t = getDict(lang);
  return {
    title: t.thanks.metaTitle,
    description: t.thanks.metaDescription,
    robots: { index: false, follow: false },
  };
}

export default async function ThankYouPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = getDict(lang);
  const ty = t.thanks;

  return (
    <>
      <BookingConfirmed />

      <header className="nav">
        <div className="nav__pill glass">
          <a href={`/${lang}`} className="nav__brand">
            <Image src={logo} alt="" width={50} height={44} priority />
            <span>
              International 7 Cup
              <small>{t.nav.sub}</small>
            </span>
          </a>
          <LangSwitch lang={lang} path="/thank-you" label={t.nav.language} />
          <a href={`/${lang}`} className="btn btn--glass btn--sm nav__cta ty__back">
            {ty.back}
          </a>
        </div>
      </header>

      <main className="ty">
        <section className="ty__hero">
          <div className="ty__burst" aria-hidden="true">
            {Array.from({ length: 14 }, (_, i) => (
              <span key={i} style={{ ['--i' as string]: i }} />
            ))}
          </div>
          <div className="orb orb--c" aria-hidden="true" />

          <div className="wrap ty__grid">
            <div className="ty__copy">
              <div className="ty__check anim" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="40" height="40">
                  <path className="ty__tick" d="m6 12.5 4 4 8-9" fill="none" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="pill pill--live anim" style={{ ['--d' as string]: '80ms' }}>
                <span className="dot" /> {ty.confirmed}
              </p>
              <h1 className="ty__title anim" style={{ ['--d' as string]: '140ms' }}>
                {ty.title}
                <br />
                <em>{ty.titleEm}</em>
              </h1>
              <p className="hero__sub anim" style={{ ['--d' as string]: '200ms' }}>
                {ty.subPre}
                <strong>{ty.subStrong}</strong>
                {ty.subPost}
              </p>
            </div>

            <figure className="ty__photo glass anim" style={{ ['--d' as string]: '220ms' }}>
              <div className="ty__photo-img">
                <Image src={squad} alt={ty.photoAlt} fill sizes="(max-width: 900px) 100vw, 520px" priority />
              </div>
              <figcaption>
                <span className="pill pill--sm">{ty.photoDate}</span>
                <span>{ty.photoPlace}</span>
              </figcaption>
            </figure>
          </div>
        </section>

        <section className="section ty__section">
          <div className="wrap">
            <div className="head">
              <p className="pill">{ty.nextPill}</p>
              <h2>
                {ty.nextTitle}
                <em>{ty.nextTitleEm}</em>
              </h2>
            </div>
            <ol className="ty__steps">
              {ty.steps.map((s, i) => (
                <li key={s.title} className="ty__step glass reveal">
                  <span className="ty__num">0{i + 1}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </li>
              ))}
            </ol>

            <div className="ty__help glass reveal">
              <div>
                <h3>{ty.helpTitle}</h3>
                <p>{ty.helpText}</p>
              </div>
              <div className="ty__help-actions">
                <a className="btn btn--primary btn--sm" href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer">
                  <span>{ty.whatsapp}</span>
                </a>
                <a className="btn btn--glass btn--sm ty__plain" href={CONTACT.phoneHref}>
                  {CONTACT.phone}
                </a>
                <a className="btn btn--glass btn--sm ty__plain" href={`mailto:${CONTACT.email}`}>
                  {CONTACT.email}
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="section ty__section">
          <div className="wrap">
            <div className="head head--center">
              <p className="pill">{ty.beforePill}</p>
              <h2>
                {ty.beforeTitle}
                <em>{ty.beforeTitleEm}</em>
              </h2>
            </div>
            <Testimonials items={getTestimonials(t)} labels={t.video} bookHref={`/${lang}#book`} />
          </div>
        </section>
      </main>

      <footer className="foot">
        <div className="wrap">
          <div className="foot__bottom">
            <p>{t.footer.rights}</p>
            <p>{t.footer.organised}</p>
          </div>
        </div>
      </footer>
    </>
  );
}
