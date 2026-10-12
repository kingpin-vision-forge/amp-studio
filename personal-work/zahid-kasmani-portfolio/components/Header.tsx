import Link from 'next/link';
import { siteConfig } from '@/site.config';
import { pageOrder, pages } from '@/content/pages';
import { profile } from '@/content/profile';
import { ui } from '@/content/ui';
import { localeHref, tx, type Locale } from '@/lib/i18n';
import LocaleToggle from './LocaleToggle';
import NavLinks from './NavLinks';

export default function Header({ locale }: { locale: Locale }) {
  const items = pageOrder
    .filter((p) => p !== 'home')
    .map((p) => ({ href: localeHref(locale, pages[p].path), label: tx(ui.nav[p], locale) }));

  return (
    <header className="border-b border-rule">
      <div className="shell flex flex-col gap-3 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-4">
          <Link href={localeHref(locale, '')} className="font-serif text-lg font-semibold">
            {tx(profile.name, locale)}
          </Link>
          <div className="lg:hidden">
            <LocaleToggle locale={locale} arabicReady={siteConfig.arabicReady} labels={toggleLabels(locale)} />
          </div>
        </div>
        <nav aria-label={tx(ui.primaryNav, locale)} className="-mx-4 px-4 lg:mx-0 lg:px-0">
          <NavLinks items={items} />
        </nav>
        <div className="hidden lg:block">
          <LocaleToggle locale={locale} arabicReady={siteConfig.arabicReady} labels={toggleLabels(locale)} />
        </div>
      </div>
    </header>
  );
}

function toggleLabels(locale: Locale) {
  return {
    toEnglish: tx(ui.localeToggle.toEnglish, locale),
    toArabic: tx(ui.localeToggle.toArabic, locale),
    arabicPending: tx(ui.localeToggle.arabicPending, locale),
    arabicPendingHint: tx(ui.localeToggle.arabicPendingHint, locale),
  };
}
