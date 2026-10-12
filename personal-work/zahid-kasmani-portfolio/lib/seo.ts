import type { Metadata } from 'next';
import { siteConfig } from '@/site.config';
import { pages, type PageKey } from '@/content/pages';
import { profile } from '@/content/profile';
import { education } from '@/content/education';
import { contact } from '@/content/contact';
import { knowsAbout, ogCard } from '@/content/ui';
import { localeHref, tx, type Locale } from '@/lib/i18n';

export function absoluteUrl(path: string): string {
  return new URL(path, siteConfig.siteUrl).toString();
}

export function pageUrl(page: PageKey, locale: Locale): string {
  return absoluteUrl(localeHref(locale, pages[page].path));
}

/** hreflang map. Arabic is only advertised once the translation is ready. */
export function languageAlternates(page: PageKey): Record<string, string> {
  const en = pageUrl(page, 'en');
  const map: Record<string, string> = { 'en-KW': en, en, 'x-default': en };
  if (siteConfig.arabicReady) map['ar-KW'] = pageUrl(page, 'ar');
  return map;
}

export function buildMetadata(page: PageKey, locale: Locale): Metadata {
  const copy = pages[page];
  const title = tx(copy.title, locale);
  const description = tx(copy.description, locale);
  const url = pageUrl(page, locale);
  const noindex = locale === 'ar' && !siteConfig.arabicReady;
  const image = { url: absoluteUrl(`/${locale}/opengraph-image`), width: 1200, height: 630, alt: tx(ogCard.alt, locale) };
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url, languages: languageAlternates(page) },
    robots: noindex ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      type: page === 'about' ? 'profile' : 'website',
      title,
      description,
      url,
      siteName: tx(profile.name, locale),
      locale: locale === 'ar' ? 'ar_KW' : 'en_KW',
      images: [image],
    },
    twitter: { card: 'summary_large_image', title, description, images: [image.url] },
  };
}

/* JSON-LD */

type Json = Record<string, unknown>;

export function graph(nodes: Json[]): Json {
  return { '@context': 'https://schema.org', '@graph': nodes };
}

export function websiteNode(locale: Locale): Json {
  return {
    '@type': 'WebSite',
    '@id': `${absoluteUrl('/')}#website`,
    name: tx(profile.name, locale),
    url: pageUrl('home', locale),
    inLanguage: locale === 'ar' ? 'ar-KW' : 'en-KW',
  };
}

export function breadcrumbNode(page: PageKey, locale: Locale): Json {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: tx(pages.home.crumb, locale), item: pageUrl('home', locale) },
      { '@type': 'ListItem', position: 2, name: tx(pages[page].crumb, locale), item: pageUrl(page, locale) },
    ],
  };
}

const credentialTitles: { title: string; category: string }[] = [
  { title: 'MBA', category: 'degree' },
  { title: 'Certified Management Accountant (CMA)', category: 'certification' },
  { title: 'Chartered Accountant', category: 'professional qualification' },
  { title: 'Cost & Management Accountant (ACWA)', category: 'professional qualification' },
  { title: 'B.Com', category: 'degree' },
  { title: 'CFO Programme', category: 'certificate' },
];

export function personNode(locale: Locale): Json {
  return {
    '@type': 'Person',
    '@id': `${absoluteUrl('/')}#person`,
    name: tx(profile.name, locale),
    jobTitle: 'Chief Financial Officer',
    worksFor: { '@type': 'Organization', name: 'Central Circle Company' },
    alumniOf: [
      { '@type': 'CollegeOrUniversity', name: 'Bentley University' },
      { '@type': 'CollegeOrUniversity', name: 'London Business School' },
      { '@type': 'CollegeOrUniversity', name: 'Mumbai University' },
    ],
    hasCredential: credentialTitles.map(({ title, category }) => {
      const item = education.find((e) => e.title === title);
      return {
        '@type': 'EducationalOccupationalCredential',
        name: title,
        credentialCategory: category,
        ...(item?.year ? { dateCreated: item.year } : {}),
      };
    }),
    knowsAbout,
    address: { '@type': 'PostalAddress', addressCountry: 'KW' },
    sameAs: [contact.linkedin],
    url: siteConfig.siteUrl,
  };
}

export function profilePageNode(locale: Locale): Json {
  return {
    '@type': 'ProfilePage',
    url: pageUrl('about', locale),
    name: tx(pages.about.title, locale),
    inLanguage: locale === 'ar' ? 'ar-KW' : 'en-KW',
    mainEntity: { '@id': `${absoluteUrl('/')}#person` },
  };
}
