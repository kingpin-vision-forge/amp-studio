import type { Metadata } from 'next';
import Link from 'next/link';
import { expertise, technicalSkills } from '@/content/expertise';
import { pages } from '@/content/pages';
import { ui } from '@/content/ui';
import { expertiseLinks } from '@/content/links';
import Breadcrumbs from '@/components/Breadcrumbs';
import EraScope from '@/components/EraScope';
import PageIntro from '@/components/PageIntro';
import T, { Latin } from '@/components/T';
import { expertiseGroupLenses } from '@/lib/content';
import { localeHref } from '@/lib/i18n';
import { eraScopeProps, resolveLocale, type LocaleParams } from '@/lib/page';
import { buildMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  return buildMetadata('expertise', await resolveLocale(params));
}

export default async function ExpertisePage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);

  return (
    <div className="shell">
      <Breadcrumbs page="expertise" locale={locale} />
      <PageIntro copy={pages.expertise} locale={locale} />

      <EraScope {...eraScopeProps(locale)}>
        <div className="grid gap-x-12 lg:grid-cols-2">
          {expertise.map((g, i) => (
            <section key={g.group.en} aria-labelledby={`expertise-${i}`} className="pt-10">
              <h2 id={`expertise-${i}`} className="border-b border-rule pb-3 font-serif text-2xl font-semibold">
                <T field={g.group} locale={locale} />
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {g.items.map((item) => (
                  <li
                    key={item}
                    data-era-dim
                    data-lenses={expertiseGroupLenses(i).join(' ')}
                    className="rounded-full border border-rule px-3 py-1 text-sm"
                  >
                    <Latin text={item} locale={locale} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </EraScope>

      <section aria-labelledby="technical-skills" className="pt-14">
        <h2 id="technical-skills" className="border-b border-rule pb-3 font-serif text-2xl font-semibold">
          <T field={ui.expertise.technicalSkills} locale={locale} />
        </h2>
        <ul className="measure mt-4 list-disc space-y-1 ps-5">
          {technicalSkills.map((s) => <li key={s}><Latin text={s} locale={locale} /></li>)}
        </ul>
      </section>

      <ul className="mt-12 flex flex-col gap-2 border-t border-rule pt-6 text-sm">
        {expertiseLinks.map((l) => (
          <li key={l.label.en}>
            <Link href={localeHref(locale, pages[l.page].path, l.hash)} className="underline decoration-accent underline-offset-4">
              <T field={l.label} locale={locale} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
