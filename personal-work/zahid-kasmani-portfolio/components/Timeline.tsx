'use client';

import { monthIndex } from '@/lib/dates';
import { scrollToId } from '@/lib/animations/media';
import { useEra } from './EraScope';

export interface TimelineRole {
  id: string;
  employer: string;
  short: string;
  title: string;
  start: string;
  end: string;
  era: string;
  /** "Employer, Title, Month YYYY to Month YYYY" */
  label: string;
  dates: string;
}

interface Props {
  roles: TimelineRole[];
  earlierFirms: string[];
  labels: { label: string; earlierGroup: string };
  /** Build month, YYYY-MM, used as "present". */
  asOf: string;
  variant?: 'full' | 'compact';
  activeId?: string | null;
}

/**
 * Career timeline, 2001 to present, built from roles.ts. Bars are sized by real dates;
 * gaps in the source stay as empty space. Earlier firms without dates sit in their own
 * group before the axis, with no bars.
 */
export default function Timeline({ roles, earlierFirms, labels, asOf, variant = 'full', activeId }: Props) {
  const era = useEra();
  const total = monthIndex(asOf) + 1;
  const pos = (r: TimelineRole) => {
    const s = monthIndex(r.start);
    const e = r.end === 'present' ? total : monthIndex(r.end);
    return { start: (s / total) * 100, size: (Math.max(e - s, 1) / total) * 100 };
  };
  const lastYear = Number(asOf.slice(0, 4));
  const ticks = [2001, 2005, 2010, 2015, 2020, 2025].filter((y) => y <= lastYear);
  const dimmed = (r: TimelineRole) => era !== 'all' && r.era !== era;
  const go = (id: string) => scrollToId(`role-${id}`);
  const active = roles.find((r) => r.id === activeId);

  const earlier = (
    <div data-earlier className={`shrink-0 transition-opacity lg:w-44 ${era !== 'all' ? 'opacity-35' : ''}`}>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted"><bdi>{labels.earlierGroup}</bdi></p>
      <ul className="mt-2 text-sm leading-snug">
        {earlierFirms.map((f) => <li key={f}><bdi>{f}</bdi></li>)}
      </ul>
    </div>
  );

  const horizontal = (
    <div className={`${variant === 'full' ? 'hidden lg:flex' : 'flex'} items-end gap-8`}>
      {variant === 'full' ? earlier : null}
      <div className="relative min-w-0 flex-1">
        <ol className={`relative ${variant === 'full' ? 'h-16' : 'h-9'}`}>
          {roles.map((r) => {
            const { start, size } = pos(r);
            const isActive = r.id === activeId;
            const endAnchored = start + size / 2 > 60;
            return (
              <li key={r.id} className="absolute bottom-0 h-full" style={{ insetInlineStart: `${start}%`, width: `${size}%` }}>
                <button
                  type="button"
                  aria-label={r.label}
                  onClick={() => go(r.id)}
                  className={`group absolute inset-0 flex flex-col justify-end transition-opacity ${dimmed(r) ? 'opacity-25' : ''}`}
                >
                  {variant === 'full' && size > 9 ? (
                    <span aria-hidden="true" className="mb-1.5 block truncate px-0.5 text-start text-xs text-muted group-hover:text-ink">
                      <bdi>{r.short}</bdi>
                    </span>
                  ) : null}
                  <span
                    aria-hidden="true"
                    className={`block h-2.5 w-full rounded-sm transition-colors ${
                      isActive ? 'bg-accent' : 'bg-muted/60 group-hover:bg-ink group-focus-visible:bg-ink'
                    }`}
                  />
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute bottom-full z-30 mb-2 hidden w-max max-w-72 rounded-md border border-rule bg-surface px-3 py-2 text-start text-xs leading-relaxed text-ink shadow-sm group-hover:block group-focus-visible:block ${
                      endAnchored ? 'end-0' : 'start-0'
                    }`}
                  >
                    <bdi className="block font-semibold">{r.employer}</bdi>
                    <bdi className="block">{r.title}</bdi>
                    <bdi className="block tabular text-muted">{r.dates}</bdi>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
        <div className="relative mt-2 h-5 border-t border-rule text-xs text-muted tabular" aria-hidden="true">
          {ticks.map((y) => (
            <span key={y} className="absolute top-1 -translate-x-1/2 rtl:translate-x-1/2" style={{ insetInlineStart: `${(monthIndex(`${y}-01`) / total) * 100}%` }}>
              {y}
            </span>
          ))}
          <span data-timeline-progress className="absolute -top-px start-0 h-0.5 w-full origin-left bg-accent opacity-0 rtl:origin-right" />
        </div>
        {variant === 'compact' ? (
          <p className="mt-1 min-h-5 truncate text-sm text-ink" aria-hidden="true">
            <bdi>{active ? `${active.short}, ${active.title}, ${active.dates}` : ''}</bdi>
          </p>
        ) : null}
      </div>
    </div>
  );

  if (variant === 'compact') {
    return <div role="group" aria-label={labels.label}>{horizontal}</div>;
  }

  return (
    <div role="group" aria-label={labels.label}>
      {horizontal}
      {/* Vertical layout for small screens */}
      <div className="lg:hidden">
        {earlier}
        <div className="relative mt-6 ms-12 h-[42rem] border-s border-rule">
          {ticks.map((y) => (
            <span
              key={y}
              aria-hidden="true"
              className="absolute -ms-12 w-10 -translate-y-1/2 text-xs text-muted tabular"
              style={{ top: `${(monthIndex(`${y}-01`) / total) * 100}%`, insetInlineStart: 0 }}
            >
              {y}
            </span>
          ))}
          <ol>
            {roles.map((r) => {
              const { start, size } = pos(r);
              return (
                <li key={r.id} className="absolute inset-x-0" style={{ top: `${start}%`, height: `${size}%` }}>
                  <button
                    type="button"
                    aria-label={r.label}
                    onClick={() => go(r.id)}
                    className={`group flex h-full w-full items-start gap-3 text-start transition-opacity ${dimmed(r) ? 'opacity-25' : ''}`}
                  >
                    <span aria-hidden="true" className="-ms-[3px] h-full w-1.5 shrink-0 rounded-sm bg-muted/60 group-hover:bg-ink group-focus-visible:bg-ink" />
                    <span aria-hidden="true" className="-mt-0.5 truncate text-xs leading-tight">
                      <bdi className="text-ink">{r.short}</bdi>{' '}
                      <span className="tabular text-muted">{r.start.slice(0, 4)}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}
