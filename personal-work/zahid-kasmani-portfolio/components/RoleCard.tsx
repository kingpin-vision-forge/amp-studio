import type { Role } from '@/content/types';
import { ui } from '@/content/ui';
import { keyFigureFor, roleDates, shownBullets } from '@/lib/content';
import { tx, type Locale } from '@/lib/i18n';
import BulletRow from './BulletRow';
import T, { Latin } from './T';

interface Props {
  role: Role;
  locale: Locale;
  headingLevel?: 2 | 3;
  /** Adds era filter attributes (Experience). */
  filterable?: boolean;
  /** Marks the section for the pinned story timeline. */
  storySection?: boolean;
  showFigures?: boolean;
}

export default function RoleCard({ role, locale, headingLevel = 2, filterable, storySection, showFigures }: Props) {
  const H = headingLevel === 2 ? 'h2' : 'h3';
  const headingId = `role-${role.id}-heading`;
  const bullets = shownBullets(role);
  const dates = roleDates(role, tx(ui.timeline.present, locale), tx(ui.timeline.to, locale));

  return (
    <article
      id={`role-${role.id}`}
      aria-labelledby={headingId}
      className="scroll-mt-6 border-t border-rule pt-8 pb-4 lg:scroll-mt-40"
      {...(filterable ? { 'data-era-item': '', 'data-era': role.era } : {})}
      {...(storySection ? { 'data-role-section': '', 'data-role-id': role.id } : {})}
    >
      <header className="row-with-margin">
        <div className="measure">
          <H id={headingId} tabIndex={-1} className="font-serif text-2xl font-semibold leading-snug">
            <Latin text={role.employer} locale={locale} />
          </H>
          <p className="mt-1 text-muted">
            <Latin text={role.title} locale={locale} />
            <span aria-hidden="true" className="mx-2">/</span>
            <span className="tabular"><Latin text={dates} locale={locale} /></span>
          </p>
          {role.summary ? (
            <p className="mt-4"><T field={role.summary} locale={locale} /></p>
          ) : null}
        </div>
      </header>
      {bullets.length > 0 ? (
        <ul className="mt-2">
          {bullets.map((b) => (
            <BulletRow
              key={b.id}
              bullet={b}
              locale={locale}
              figure={showFigures ? keyFigureFor(b.id)?.value : undefined}
            />
          ))}
        </ul>
      ) : null}
    </article>
  );
}
