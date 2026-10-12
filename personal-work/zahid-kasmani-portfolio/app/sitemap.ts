import type { MetadataRoute } from 'next';
import { siteConfig } from '@/site.config';
import { pageOrder } from '@/content/pages';
import { languageAlternates, pageUrl } from '@/lib/seo';

export const dynamic = 'force-static';

/** English pages always; Arabic pages only once siteConfig.arabicReady is true. */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const locales = siteConfig.arabicReady ? (['en', 'ar'] as const) : (['en'] as const);
  return locales.flatMap((locale) =>
    pageOrder.map((page) => ({
      url: pageUrl(page, locale),
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: page === 'home' ? 1 : 0.7,
      alternates: { languages: languageAlternates(page) },
    })),
  );
}
