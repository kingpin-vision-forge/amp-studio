import type { Metadata } from 'next';
import Link from 'next/link';
import { chapters, foundationQualifications } from '@/content/story';
import { earlierFirms } from '@/content/roles';
import { pages } from '@/content/pages';
import { ui } from '@/content/ui';
import Breadcrumbs from '@/components/Breadcrumbs';
import FigureReveal from '@/components/FigureReveal';
import PageIntro from '@/components/PageIntro';
import RoleCard from '@/components/RoleCard';
import StoryShell from '@/components/StoryShell';
import T, { Latin } from '@/components/T';
import { chapterIntro, educationByTitle, getRole, joinLocalized } from '@/lib/content';
import { localeHref, tx } from '@/lib/i18n';
import { resolveLocale, timelineProps, type LocaleParams } from '@/lib/page';
import { buildMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  return buildMetadata('story', await resolveLocale(params));
}

export default async function StoryPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const rail = chapters.map((c) => ({ id: c.id, title: tx(c.title, locale), span: tx(c.span, locale) }));

  return (
    <div className="shell">
      <Breadcrumbs page="story" locale={locale} />
      <PageIntro copy={pages.story} locale={locale} />

      <StoryShell chapters={rail} timeline={timelineProps(locale)} railLabel={tx(ui.progressRail.label, locale)}>
        {chapters.map((chapter, i) => (
          <section
            key={chapter.id}
            id={`chapter-${chapter.id}`}
            data-chapter
            aria-labelledby={`chapter-${chapter.id}-title`}
            className="scroll-mt-14 pt-12 lg:scroll-mt-40"
          >
            <h2 id={`chapter-${chapter.id}-title`} tabIndex={-1} className="font-serif text-3xl font-semibold sm:text-4xl">
              <span className="block text-sm font-normal tracking-wide text-muted tabular">
                {String(i + 1).padStart(2, '0')}
                <span aria-hidden="true" className="mx-2">/</span>
                <T field={chapter.span} locale={locale} />
              </span>
              <span className="mt-1 block"><T field={chapter.title} locale={locale} /></span>
            </h2>
            <p className="measure mt-6 text-lg leading-relaxed">
              <T field={joinLocalized(chapterIntro(chapter).map((s) => s.text))} locale={locale} />
            </p>

            {chapter.showQualifications ? (
              <ul className="mt-8 grid gap-4 border-t border-rule pt-6 sm:grid-cols-3">
                {foundationQualifications.map((title) => {
                  const q = educationByTitle(title);
                  if (!q) return null;
                  return (
                    <li key={title}>
                      <span className="block font-serif text-2xl tabular"><Latin text={q.year ?? ''} locale={locale} /></span>
                      <span className="block font-semibold"><Latin text={q.title} locale={locale} /></span>
                      {q.institution ? <span className="block text-sm text-muted"><Latin text={q.institution} locale={locale} /></span> : null}
                    </li>
                  );
                })}
              </ul>
            ) : null}

            {chapter.showEarlierFirms ? (
              <div className="mt-8 border-t border-rule pt-6">
                <h3 className="font-serif text-xl font-semibold"><T field={ui.timeline.earlierGroup} locale={locale} /></h3>
                <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-muted">
                  {earlierFirms.map((f) => <li key={f}><Latin text={f} locale={locale} /></li>)}
                </ul>
              </div>
            ) : null}

            <div className="mt-6">
              {chapter.roles.map((id) => (
                <RoleCard key={id} role={getRole(id)} locale={locale} headingLevel={3} storySection showFigures />
              ))}
            </div>

            <ul className="mt-6 flex flex-col gap-2 text-sm">
              {chapter.links.map((l) => (
                <li key={l.label.en}>
                  <Link href={localeHref(locale, pages[l.page].path, l.hash)} className="underline decoration-accent underline-offset-4">
                    <T field={l.label} locale={locale} />
                  </Link>
                </li>
              ))}
            </ul>

            <hr className="mx-auto mt-14 w-16 border-rule" />
          </section>
        ))}
      </StoryShell>

      <FigureReveal />
    </div>
  );
}
