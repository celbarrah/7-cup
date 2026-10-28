import { CONTACT, CONTENT_UPDATED, SITE_NAME, SITE_URL } from '@/lib/config';
import type { Dict, Lang } from '@/lib/i18n';

const abs = (p: string) => `${SITE_URL}${p}`;
const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;
const EVENT_ID = `${SITE_URL}/#event-2027`;

/**
 * One connected schema.org @graph per language: Organization → WebSite → WebPage → SportsEvent
 * (with Offer + Place) → FAQPage. Entities reference each other by @id so search engines
 * read them as a single knowledge graph instead of unrelated snippets.
 */
export function buildJsonLd(lang: Lang, t: Dict) {
  const pageUrl = abs(`/${lang}`);
  const inLanguage = lang === 'fr' ? 'fr-FR' : 'en-US';
  const images = [abs(`/og/og-${lang}.jpg`), abs('/images/stade-hero.webp'), abs('/images/167A1640.webp'), abs('/images/167A1764.webp')];

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SportsOrganization',
        '@id': ORG_ID,
        name: SITE_NAME,
        alternateName: ['International Seven Cup', 'IC7M', 'International 7 Cup'],
        url: SITE_URL,
        logo: { '@type': 'ImageObject', url: abs('/icons/icon-512.png'), width: 512, height: 512 },
        image: abs('/images/stade-hero.webp'),
        sport: 'Football',
        email: CONTACT.email,
        telephone: CONTACT.phone.replace(/\s/g, ''),
        address: { '@type': 'PostalAddress', addressLocality: 'Marrakech', addressCountry: 'MA' },
        sameAs: [CONTACT.facebook, CONTACT.linkedin],
        founder: [
          { '@type': 'Person', name: 'Abdellah Marrakchi' },
          { '@type': 'Person', name: 'Jalil Fredj' },
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'sales',
          email: CONTACT.email,
          telephone: CONTACT.phone.replace(/\s/g, ''),
          availableLanguage: ['French', 'English'],
        },
      },
      {
        '@type': 'WebSite',
        '@id': SITE_ID,
        url: SITE_URL,
        name: SITE_NAME,
        publisher: { '@id': ORG_ID },
        inLanguage: ['fr-FR', 'en-US'],
      },
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: t.meta.title,
        description: t.meta.description,
        inLanguage,
        isPartOf: { '@id': SITE_ID },
        about: { '@id': EVENT_ID },
        primaryImageOfPage: { '@type': 'ImageObject', url: abs(`/og/og-${lang}.jpg`), width: 1200, height: 630 },
        dateModified: CONTENT_UPDATED,
        potentialAction: { '@type': 'ReserveAction', target: `${pageUrl}#book`, name: t.nav.cta },
      },
      {
        '@type': 'SportsEvent',
        '@id': EVENT_ID,
        name: lang === 'fr' ? 'International 7 Cup 2027 — 12ème édition' : 'International 7 Cup 2027 — 12th Edition',
        description: t.meta.description,
        sport: 'Football',
        inLanguage,
        url: pageUrl,
        image: images,
        startDate: '2027-05-27T09:00:00+01:00',
        endDate: '2027-05-30T12:00:00+01:00',
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        location: {
          '@type': 'StadiumOrArena',
          name: t.experience.a.title,
          address: { '@type': 'PostalAddress', addressLocality: 'Marrakech', addressRegion: 'Marrakech-Safi', addressCountry: 'MA' },
        },
        organizer: { '@id': ORG_ID },
        performer: { '@type': 'PerformingGroup', name: lang === 'fr' ? 'Équipes d’entreprises de 22 pays' : 'Corporate teams from 22 countries' },
        offers: {
          '@type': 'Offer',
          name: t.book.priceLabel,
          url: `${pageUrl}#book`,
          price: '750',
          priceCurrency: 'EUR',
          priceSpecification: { '@type': 'UnitPriceSpecification', price: 750, priceCurrency: 'EUR', valueAddedTaxIncluded: false },
          availability: 'https://schema.org/LimitedAvailability',
          validFrom: '2026-09-01T00:00:00+01:00',
          seller: { '@id': ORG_ID },
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `${pageUrl}#faq`,
        inLanguage,
        isPartOf: { '@id': `${pageUrl}#webpage` },
        mainEntity: t.faq.items.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
      },
    ],
  };
}
