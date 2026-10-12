import type { Metadata } from 'next';
import { education } from '@/content/education';
import { training } from '@/content/training';
import { pages } from '@/content/pages';
import { ui } from '@/content/ui';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageIntro from '@/components/PageIntro';
import T, { Latin } from '@/components/T';
import { resolveLocale, type LocaleParams } from '@/lib/page';
import { buildMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  return buildMetadata('credentials', await resolveLocale(params));
}

export default async function CredentialsPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);

  return (
    <div className="shell">
      <Breadcrumbs page="credentials" locale={locale} />
      <PageIntro copy={pages.credentials} locale={locale} />

      <section aria-labelledby="education" className="pt-6">
        <h2 id="education" className="border-b border-rule pb-3 font-serif text-2xl font-semibold">
          <T field={ui.credentials.education} locale={locale} />
        </h2>
        <ul>
          {education.map((e) => (
            <li key={e.title} className="grid gap-x-8 border-b border-rule py-5 sm:grid-cols-[6rem_minmax(0,1fr)]">
              <span className="font-serif text-xl text-muted tabular">{e.year ? <Latin text={e.year} locale={locale} /> : null}</span>
              <div>
                <p className="font-semibold"><Latin text={e.title} locale={locale} /></p>
                {e.institution ? <p className="text-muted"><Latin text={e.institution} locale={locale} /></p> : null}
                {e.note ? <p className="mt-1 text-sm"><Latin text={e.note} locale={locale} /></p> : null}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="training" className="pt-14">
        <h2 id="training" className="border-b border-rule pb-3 font-serif text-2xl font-semibold">
          <T field={ui.credentials.training} locale={locale} />
        </h2>
        <ul className="measure mt-4 list-disc space-y-1 ps-5">
          {training.map((t) => <li key={t}><Latin text={t} locale={locale} /></li>)}
        </ul>
      </section>
    </div>
  );
}
