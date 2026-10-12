import type { Metadata } from 'next';
import Link from 'next/link';
import { education } from '@/content/education';
import { profile } from '@/content/profile';
import { pages } from '@/content/pages';
import { knowsAbout, ui } from '@/content/ui';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import MarginNote from '@/components/MarginNote';
import PageIntro from '@/components/PageIntro';
import T, { Latin } from '@/components/T';
import { localeHref } from '@/lib/i18n';
import { resolveLocale, type LocaleParams } from '@/lib/page';
import { buildMetadata, graph, personNode, profilePageNode } from '@/lib/seo';

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  return buildMetadata('about', await resolveLocale(params));
}

const sectionTitle = 'border-b border-rule pb-3 font-serif text-2xl font-semibold';

export default async function AboutPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);

  return (
    <div className="shell">
      <JsonLd data={graph([profilePageNode(locale), personNode(locale)])} />
      <Breadcrumbs page="about" locale={locale} />
      <PageIntro copy={pages.about} locale={locale} />

      <section aria-labelledby="current-role" className="pb-6">
        <h2 id="current-role" className="text-sm font-semibold uppercase tracking-wider text-muted">
          <T field={ui.about.currentRole} locale={locale} />
        </h2>
        <p className="mt-1"><T field={profile.currentRole} locale={locale} /></p>
        <p className="mt-1 text-sm text-muted"><T field={profile.headline} locale={locale} /></p>
      </section>

      <section aria-labelledby="executive-summary" className="pt-8">
        <h2 id="executive-summary" className={sectionTitle}><T field={ui.about.executiveSummary} locale={locale} /></h2>
        <div>
          {profile.executiveSummary.map((para, i) => {
            const notes = profile.summaryCallouts.filter((c) => c.para === i);
            return (
              <div key={i} className="row-with-margin py-4">
                <p className="measure"><T field={para} locale={locale} /></p>
                <div className="mt-2 flex flex-wrap gap-2 lg:mt-1 lg:flex-col lg:gap-4">
                  {notes.map((n) => (
                    <MarginNote key={n.callout.en} callout={<T field={n.callout} locale={locale} />}>
                      <T field={n.text} locale={locale} />
                    </MarginNote>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="executive-profile" className="pt-12">
        <h2 id="executive-profile" className={sectionTitle}><T field={ui.about.executiveProfile} locale={locale} /></h2>
        <p className="measure mt-4"><T field={profile.executiveProfile} locale={locale} /></p>
      </section>

      <div className="grid gap-x-12 pt-12 lg:grid-cols-2">
        <section aria-labelledby="qualifications">
          <h2 id="qualifications" className={sectionTitle}><T field={ui.about.qualifications} locale={locale} /></h2>
          <p className="mt-4 font-semibold"><T field={profile.credentials} locale={locale} /></p>
          <ul className="mt-3 space-y-1 text-[0.975rem]">
            {education.filter((e) => e.institution && e.year).map((e) => (
              <li key={e.title}>
                <Latin text={e.title} locale={locale} />, <span className="text-muted"><Latin text={`${e.institution}, ${e.year}`} locale={locale} /></span>
              </li>
            ))}
          </ul>
          <Link href={localeHref(locale, 'credentials')} className="mt-4 inline-block text-sm underline decoration-accent underline-offset-4">
            <T field={pages.credentials.crumb} locale={locale} />
          </Link>
        </section>
        <section aria-labelledby="areas" className="pt-12 lg:pt-0">
          <h2 id="areas" className={sectionTitle}><T field={ui.about.areas} locale={locale} /></h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {knowsAbout.map((k) => (
              <li key={k} className="rounded-full border border-rule px-3 py-1 text-sm"><Latin text={k} locale={locale} /></li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
