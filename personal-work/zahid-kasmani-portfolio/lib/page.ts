import { notFound } from 'next/navigation';
import { roles, earlierFirms } from '@/content/roles';
import { eras } from '@/content/eras';
import { ui } from '@/content/ui';
import { lensesByEra, roleDates, shortEmployer } from '@/lib/content';
import { isLocale, tx, type Locale } from '@/lib/i18n';
import type { TimelineRole } from '@/components/Timeline';

export type LocaleParams = { params: Promise<{ locale: string }> };

export async function resolveLocale(params: LocaleParams['params']): Promise<Locale> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return locale;
}

/** Build month, used as "present" on the timeline. Static at build time. */
export function buildMonth(): string {
  return new Date().toISOString().slice(0, 7);
}

/** Roles in chronological order with accessible labels, for the timeline. */
export function timelineProps(locale: Locale) {
  const present = tx(ui.timeline.present, locale);
  const to = tx(ui.timeline.to, locale);
  const list: TimelineRole[] = [...roles]
    .sort((a, b) => a.start.localeCompare(b.start))
    .map((r) => {
      const dates = roleDates(r, present, to);
      return {
        id: r.id,
        employer: r.employer,
        short: shortEmployer(r.employer),
        title: r.title,
        start: r.start,
        end: r.end,
        era: r.era,
        dates,
        label: `${r.employer}, ${r.title}, ${dates}`,
      };
    });
  return {
    roles: list,
    earlierFirms,
    labels: { label: tx(ui.timeline.label, locale), earlierGroup: tx(ui.timeline.earlierGroup, locale) },
    asOf: buildMonth(),
  };
}

export function eraScopeProps(locale: Locale) {
  return {
    eras: eras.map((e) => ({ id: e.id, label: tx(e.label, locale) })),
    labels: { legend: tx(ui.eraFilter.legend, locale), all: tx(ui.eraFilter.all, locale) },
    lensesByEra: lensesByEra(),
  };
}
