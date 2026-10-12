import Link from 'next/link';
import { pages, type PageKey } from '@/content/pages';
import { ui } from '@/content/ui';
import { breadcrumbNode, graph } from '@/lib/seo';
import { localeHref, tx, type Locale } from '@/lib/i18n';
import JsonLd from './JsonLd';
import T from './T';

/** Visible breadcrumb plus matching BreadcrumbList JSON-LD. */
export default function Breadcrumbs({ page, locale }: { page: PageKey; locale: Locale }) {
  return (
    <>
      <nav aria-label={tx(ui.breadcrumb, locale)} className="pt-8 text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href={localeHref(locale, '')} className="underline-offset-4 hover:underline">
              <T field={pages.home.crumb} locale={locale} />
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-ink">
            <T field={pages[page].crumb} locale={locale} />
          </li>
        </ol>
      </nav>
      <JsonLd data={graph([breadcrumbNode(page, locale)])} />
    </>
  );
}
