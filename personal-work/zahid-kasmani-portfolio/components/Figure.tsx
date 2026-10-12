import type { Locale } from '@/lib/i18n';
import { Latin } from './T';

/**
 * A key figure, rendered as final text in the HTML (no count-up).
 * FigureReveal fades it in when its explaining paragraph ([data-reveal-trigger]) enters view.
 */
export default function Figure({ value, locale, size = 'lg' }: { value: string; locale: Locale; size?: 'lg' | 'md' }) {
  return (
    <span
      data-reveal-figure
      className={`block font-serif font-semibold tabular leading-none tracking-tight text-ink ${
        size === 'lg' ? 'text-4xl sm:text-5xl' : 'text-3xl'
      }`}
    >
      <Latin text={value} locale={locale} />
    </span>
  );
}
