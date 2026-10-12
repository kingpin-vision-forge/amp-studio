import { Fragment } from 'react';
import type { Localized } from '@/content/types';
import type { Locale } from '@/lib/i18n';

const LATIN_RUN = /([A-Za-z0-9][A-Za-z0-9.,%+&'\-/ ]*[A-Za-z0-9%+.]|[A-Za-z0-9])/g;

/** Wrap Latin and numeric runs inside Arabic text in <bdi> to prevent reordering. */
function isolateLatin(text: string) {
  const parts = text.split(LATIN_RUN);
  return parts.map((part, i) =>
    i % 2 === 1 ? <bdi key={i}>{part}</bdi> : <Fragment key={i}>{part}</Fragment>,
  );
}

/** Render a localized field. Arabic falls back to English, isolated as an LTR run. */
export default function T({ field, locale }: { field: Localized; locale: Locale }) {
  if (locale !== 'ar') return <>{field.en}</>;
  if (!field.ar) return <bdi lang="en">{field.en}</bdi>;
  return <>{isolateLatin(field.ar)}</>;
}

/** Render a Latin-script string (institution, figure, currency) safely in either locale. */
export function Latin({ text, locale }: { text: string; locale: Locale }) {
  return locale === 'ar' ? <bdi lang="en">{text}</bdi> : <>{text}</>;
}
