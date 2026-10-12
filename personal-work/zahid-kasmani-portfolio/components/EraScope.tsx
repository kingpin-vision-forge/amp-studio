'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import type { EraId, Lens } from '@/content/types';
import { Flip, gsap } from '@/lib/animations/flip';
import { EASE_IN_OUT, EASE_OUT, MOTION_OK } from '@/lib/animations/media';

export type EraValue = EraId | 'all';

const EraContext = createContext<EraValue>('all');
export const useEra = () => useContext(EraContext);

interface Props {
  eras: { id: EraId; label: string }[];
  labels: { legend: string; all: string };
  lensesByEra: Record<EraId, Lens[]>;
  children: ReactNode;
}

/** Show/hide/dim every filterable element inside `root` for the given era. */
function applyEra(root: HTMLElement, era: EraValue, lensesByEra: Record<EraId, Lens[]>) {
  root.querySelectorAll<HTMLElement>('[data-era-item]').forEach((el) => {
    const itemEras = (el.dataset.era ?? '').split(' ').filter(Boolean);
    el.hidden = !(era === 'all' || itemEras.includes(era));
  });
  root.querySelectorAll<HTMLElement>('[data-era-group]').forEach((group) => {
    const items = [...group.querySelectorAll<HTMLElement>('[data-era-item]')];
    group.hidden = !items.some((el) => !el.hidden);
  });
  root.querySelectorAll<HTMLElement>('[data-era-dim]').forEach((el) => {
    const lenses = (el.dataset.lenses ?? '').split(' ') as Lens[];
    const dim = era !== 'all' && !lenses.some((l) => lensesByEra[era].includes(l));
    el.toggleAttribute('data-dimmed', dim);
  });
}

/**
 * Feature 3: era filter. One radiogroup filters the timeline, role cards, achievements,
 * and expertise tags inside this scope. The URL carries ?era=e3 so views are shareable.
 * Without JavaScript, everything is shown (the "All" view).
 */
export default function EraScope({ eras, labels, lensesByEra, children }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const motionRef = useRef(false);
  const [era, setEra] = useState<EraValue>('all');
  const options: { id: EraValue; label: string }[] = [{ id: 'all', label: labels.all }, ...eras];

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      motionRef.current = true;
      return () => { motionRef.current = false; };
    });
    const param = new URLSearchParams(location.search).get('era');
    if (param && eras.some((e) => e.id === param) && rootRef.current) {
      applyEra(rootRef.current, param as EraId, lensesByEra);
      setEra(param as EraId);
    }
    return () => mm.revert();
  }, [eras, lensesByEra]);

  const change = useCallback(
    (next: EraValue) => {
      const root = rootRef.current;
      if (!root || next === era) return;
      const url = new URL(location.href);
      if (next === 'all') url.searchParams.delete('era');
      else url.searchParams.set('era', next);
      history.replaceState(history.state, '', url);

      if (!motionRef.current) {
        applyEra(root, next, lensesByEra);
        setEra(next);
        return;
      }
      const targets = root.querySelectorAll('[data-era-item], [data-era-group]');
      const state = Flip.getState(targets);
      applyEra(root, next, lensesByEra);
      setEra(next);
      Flip.from(state, {
        duration: 0.35,
        ease: EASE_IN_OUT,
        absolute: true,
        nested: true,
        prune: true,
        onEnter: (els) => gsap.fromTo(els, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: EASE_OUT }),
        onLeave: (els) => gsap.to(els, { opacity: 0, duration: 0.3, ease: EASE_OUT }),
      });
    },
    [era, lensesByEra],
  );

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const rtl = getComputedStyle(e.currentTarget).direction === 'rtl';
    const forward = rtl ? 'ArrowLeft' : 'ArrowRight';
    const back = rtl ? 'ArrowRight' : 'ArrowLeft';
    const i = options.findIndex((o) => o.id === era);
    let n = -1;
    if (e.key === forward || e.key === 'ArrowDown') n = (i + 1) % options.length;
    else if (e.key === back || e.key === 'ArrowUp') n = (i - 1 + options.length) % options.length;
    else if (e.key === 'Home') n = 0;
    else if (e.key === 'End') n = options.length - 1;
    if (n < 0) return;
    e.preventDefault();
    change(options[n]!.id);
    e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="radio"]')[n]?.focus();
  };

  return (
    <EraContext.Provider value={era}>
      <div ref={rootRef}>
        <div className="sticky top-0 z-30 -mx-4 border-b border-rule bg-paper/95 px-4 py-3 backdrop-blur-[2px] lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:px-0">
          <div
            role="radiogroup"
            aria-label={labels.legend}
            onKeyDown={onKeyDown}
            className="flex gap-1 overflow-x-auto rounded-full border border-rule p-1 text-sm lg:inline-flex"
          >
            {options.map((o) => {
              const checked = o.id === era;
              return (
                <button
                  key={o.id}
                  type="button"
                  role="radio"
                  aria-checked={checked}
                  tabIndex={checked ? 0 : -1}
                  onClick={() => change(o.id)}
                  className="shrink-0 rounded-full px-3 py-1.5 tabular text-muted transition-colors hover:text-ink aria-checked:bg-accent aria-checked:text-paper"
                >
                  <bdi>{o.label}</bdi>
                </button>
              );
            })}
          </div>
        </div>
        {children}
      </div>
    </EraContext.Provider>
  );
}
