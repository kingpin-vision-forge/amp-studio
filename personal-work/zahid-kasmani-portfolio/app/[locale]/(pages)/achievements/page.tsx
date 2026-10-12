import type { Metadata } from 'next';
import Link from 'next/link';
import { roles } from '@/content/roles';
import { pages } from '@/content/pages';
import { lensNames, lensOrder, ui } from '@/content/ui';
import { achievementsLinks } from '@/content/links';
import Breadcrumbs from '@/components/Breadcrumbs';
import BulletRow from '@/components/BulletRow';
import EraScope from '@/components/EraScope';
import FigureReveal from '@/components/FigureReveal';
import PageIntro from '@/components/PageIntro';
import T, { Latin } from '@/components/T';
import { keyFigureFor, shortEmployer, shownBullets, shownHighlights } from '@/lib/content';
import { localeHref } from '@/lib/i18n';
import { eraScopeProps, resolveLocale, type LocaleParams } from '@/lib/page';
import { buildMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  return buildMetadata('achievements', await resolveLocale(params));
}

export default async function AchievementsPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  // Each item is grouped under its first (primary) lens so nothing is listed twice.
  const attributed = roles.flatMap((role) => shownBullets(role).map((bullet) => ({ bullet, role })));
  const unattributed = shownHighlights();

  return (
    <div className="shell">
      <Breadcrumbs page="achievements" locale={locale} />
      <PageIntro copy={pages.achievements} locale={locale} />

      <EraScope {...eraScopeProps(locale)}>
        {lensOrder.map((lens) => {
          const items = attributed.filter((a) => a.bullet.lens[0] === lens);
          const extra = unattributed.filter((h) => h.lens[0] === lens);
          if (items.length + extra.length === 0) return null;
          return (
            <section key={lens} id={`lens-${lens}`} data-era-group aria-labelledby={`lens-${lens}-title`} className="scroll-mt-20 pt-12">
              <h2 id={`lens-${lens}-title`} className="border-b border-rule pb-3 font-serif text-2xl font-semibold">
                <T field={lensNames[lens]} locale={locale} />
              </h2>
              {items.length > 0 ? (
                <ul>
                  {items.map(({ bullet, role }) => (
                    <BulletRow
                      key={bullet.id}
                      bullet={bullet}
                      locale={locale}
                      era={role.era}
                      figure={keyFigureFor(bullet.id)?.value}
                      meta={<Latin text={shortEmployer(role.employer)} locale={locale} />}
                    />
                  ))}
                </ul>
              ) : null}
              {extra.length > 0 ? (
                <div data-era-item data-era="" className="mt-4">
                  <p className="text-sm italic text-muted"><T field={ui.eraFilter.unattributedNote} locale={locale} /></p>
                  <ul>
                    {extra.map((h) => <BulletRow key={h.id} bullet={h} locale={locale} />)}
                  </ul>
                </div>
              ) : null}
            </section>
          );
        })}
      </EraScope>

      <ul className="mt-12 flex flex-col gap-2 border-t border-rule pt-6 text-sm">
        {achievementsLinks.map((l) => (
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
