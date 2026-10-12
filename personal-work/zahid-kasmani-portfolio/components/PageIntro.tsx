import type { PageCopy } from '@/content/pages';
import type { Locale } from '@/lib/i18n';
import T from './T';

/** H1 plus the plain-language summary that opens every page. */
export default function PageIntro({ copy, locale }: { copy: PageCopy; locale: Locale }) {
  return (
    <header className="pt-10 pb-8 sm:pt-16">
      <h1 className="measure font-serif text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
        <T field={copy.h1} locale={locale} />
      </h1>
      <p className="measure mt-6 text-lg leading-relaxed text-ink/90">
        <T field={copy.summary} locale={locale} />
      </p>
    </header>
  );
}
