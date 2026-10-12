import type { Localized } from '@/content/types';

export const locales = ['en', 'ar'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Resolve a localized field; Arabic falls back to English when missing. */
export function tx(field: Localized, locale: Locale): string {
  return locale === 'ar' && field.ar ? field.ar : field.en;
}

/** True when the Arabic route is showing an English fallback for this field. */
export function isFallback(field: Localized, locale: Locale): boolean {
  return locale === 'ar' && !field.ar;
}

export function dirOf(locale: Locale): 'ltr' | 'rtl' {
  return locale === 'ar' ? 'rtl' : 'ltr';
}

/** Build an internal href: /en, /en/story, /en/experience#role-kib */
export function localeHref(locale: Locale, path: string, hash?: string): string {
  const base = path ? `/${locale}/${path}` : `/${locale}`;
  return hash ? `${base}#${hash}` : base;
}
