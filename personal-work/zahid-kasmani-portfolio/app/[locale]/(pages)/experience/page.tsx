import type { Metadata } from 'next';
import Link from 'next/link';
import { roles } from '@/content/roles';
import { pages } from '@/content/pages';
import Breadcrumbs from '@/components/Breadcrumbs';
import EraScope from '@/components/EraScope';
import FigureReveal from '@/components/FigureReveal';
import PageIntro from '@/components/PageIntro';
import RoleCard from '@/components/RoleCard';
import T from '@/components/T';
import Timeline from '@/components/Timeline';
import { localeHref } from '@/lib/i18n';
import { eraScopeProps, resolveLocale, timelineProps, type LocaleParams } from '@/lib/page';
import { buildMetadata } from '@/lib/seo';
import { experienceLinks } from '@/content/links';

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  return buildMetadata('experience', await resolveLocale(params));
}

export default async function ExperiencePage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);

  return (
    <div className="shell">
      <Breadcrumbs page="experience" locale={locale} />
      <PageIntro copy={pages.experience} locale={locale} />

      <EraScope {...eraScopeProps(locale)}>
        <div className="mt-8 mb-12">
          <Timeline {...timelineProps(locale)} />
        </div>
        <div>
          {roles.map((role) => (
            <RoleCard key={role.id} role={role} locale={locale} filterable showFigures />
          ))}
        </div>
      </EraScope>

      <ul className="mt-12 flex flex-col gap-2 border-t border-rule pt-6 text-sm">
        {experienceLinks.map((l) => (
          <li key={l.label.en}>
            <Link href={localeHref(locale, pages[l.page].path, l.hash)} className="underline decoration-accent underline-offset-4">
              <T field={l.label} locale={locale} />
            </Link>
          </li>
        ))}
      </ul>
      <FigureReveal />
    </div>
  );
}
