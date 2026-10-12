'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Props {
  locale: 'en' | 'ar';
  arabicReady: boolean;
  labels: { toEnglish: string; toArabic: string; arabicPending: string; arabicPendingHint: string };
}

/**
 * Feature 5: dual-language toggle. Swaps the locale segment and keeps the rest of the path.
 * Until arabicReady, the Arabic option is shown but disabled.
 */
export default function LocaleToggle({ locale, arabicReady, labels }: Props) {
  const pathname = usePathname() ?? `/${locale}`;
  const swap = (target: string) => pathname.replace(/^\/(en|ar)(?=\/|$)/, `/${target}`);
  const cls = 'rounded-full border border-rule px-3 py-1 text-sm';

  if (locale === 'ar') {
    return (
      <Link href={swap('en')} hrefLang="en" lang="en" className={`${cls} hover:border-accent`}>
        {labels.toEnglish}
      </Link>
    );
  }
  if (!arabicReady) {
    return (
      <span aria-disabled="true" lang="ar" dir="rtl" title={labels.arabicPendingHint} className={`${cls} cursor-not-allowed text-muted`}>
        {labels.arabicPending}
      </span>
    );
  }
  return (
    <Link href={swap('ar')} hrefLang="ar" lang="ar" className={`${cls} hover:border-accent`}>
      {labels.toArabic}
    </Link>
  );
}
