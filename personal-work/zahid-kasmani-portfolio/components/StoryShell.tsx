'use client';

import { useRef, useState, type ReactNode } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/animations/gsap';
import { DESKTOP, MOTION_OK, scrollToId } from '@/lib/animations/media';
import Timeline, { type TimelineRole } from './Timeline';

export interface RailChapter { id: string; title: string; span: string; }

interface Props {
  chapters: RailChapter[];
  timeline: { roles: TimelineRole[]; earlierFirms: string[]; labels: { label: string; earlierGroup: string }; asOf: string };
  railLabel: string;
  children: ReactNode;
}

/**
 * /story layout: chapter progress rail (feature 2) plus the pinned timeline.
 * - Rail: sticky at the inline-start edge on desktop; a slim top bar on mobile.
 * - Timeline: pinned (scrub 0.5) on desktop with motion allowed, unpinned after the last role.
 * Active chapter and role are state changes only, so they also work with reduced motion.
 */
export default function StoryShell({ chapters, timeline, railLabel, children }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [activeChapter, setActiveChapter] = useState(0);
  const [activeRole, setActiveRole] = useState<string | null>(null);
  const [inStory, setInStory] = useState(false);

  useGSAP(
    () => {
      const root = rootRef.current!;
      const sections = gsap.utils.toArray<HTMLElement>('[data-chapter]', root);
      const roleSections = gsap.utils.toArray<HTMLElement>('[data-role-section]', root);

      sections.forEach((section, i) => {
        ScrollTrigger.create({
          trigger: section,
          start: 'top 45%',
          end: 'bottom 45%',
          onToggle: (self) => self.isActive && setActiveChapter(i),
        });
      });
      roleSections.forEach((section) => {
        ScrollTrigger.create({
          trigger: section,
          start: 'top 50%',
          end: 'bottom 50%',
          onToggle: (self) => self.isActive && setActiveRole(section.dataset.roleId ?? null),
        });
      });
      ScrollTrigger.create({
        trigger: '[data-story-narrative]',
        start: 'top top',
        end: 'bottom bottom',
        onToggle: (self) => setInStory(self.isActive),
        onUpdate: (self) => {
          if (barRef.current) barRef.current.style.transform = `scaleX(${self.progress.toFixed(3)})`;
        },
      });

      const mm = gsap.matchMedia();
      mm.add(`${MOTION_OK} and ${DESKTOP}`, () => {
        const lastRole = roleSections[roleSections.length - 1];
        const progress = timelineRef.current?.querySelector('[data-timeline-progress]');
        if (!timelineRef.current || !lastRole || !progress) return;
        gsap.set(progress, { opacity: 1 });
        gsap.fromTo(
          progress,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: timelineRef.current,
              start: 'top top',
              endTrigger: lastRole,
              end: 'bottom 75%',
              pin: true,
              pinSpacing: false,
              scrub: 0.5,
            },
          },
        );
      });

      document.fonts?.ready.then(() => ScrollTrigger.refresh());
      return () => mm.revert();
    },
    { scope: rootRef },
  );

  const current = chapters[activeChapter];

  return (
    <div ref={rootRef} className="lg:grid lg:grid-cols-12 lg:gap-x-8">
      {/* Mobile: slim top progress bar with the current chapter name */}
      <div
        aria-hidden="true"
        className={`fixed inset-x-0 top-0 z-40 border-b border-rule bg-paper/95 transition-opacity lg:hidden ${
          inStory ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <p className="shell truncate py-2 text-sm">
          <span className="font-serif font-semibold"><bdi>{current?.title}</bdi></span>
          <span className="ms-2 text-muted tabular"><bdi>{current?.span}</bdi></span>
        </p>
        <div ref={barRef} className="h-0.5 origin-left bg-accent rtl:origin-right" style={{ transform: 'scaleX(0)' }} />
      </div>

      {/* Desktop rail */}
      <nav aria-label={railLabel} className="hidden lg:col-span-2 lg:block">
        <ol className="sticky top-36 border-s border-rule">
          {chapters.map((c, i) => {
            const state = i === activeChapter ? 'active' : i < activeChapter ? 'done' : 'todo';
            return (
              <li key={c.id} className="-ms-px">
                <a
                  href={`#chapter-${c.id}`}
                  aria-current={state === 'active' ? 'step' : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToId(`chapter-${c.id}`);
                  }}
                  className={`flex items-start gap-3 border-s-2 py-2.5 ps-4 text-sm leading-snug ${
                    state === 'active' ? 'border-accent text-ink' : 'border-transparent'
                  } ${state === 'done' ? 'text-muted' : ''} ${state === 'todo' ? 'text-ink/80' : ''} hover:text-ink`}
                >
                  <span
                    aria-hidden="true"
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full border ${
                      state === 'active' ? 'border-accent bg-accent' : state === 'done' ? 'border-muted bg-muted/50' : 'border-muted bg-transparent'
                    }`}
                  />
                  <span>
                    <bdi className="block font-serif text-base">{c.title}</bdi>
                    <bdi className="block text-xs text-muted tabular">{c.span}</bdi>
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="lg:col-span-10">
        <div ref={timelineRef} className="relative z-20 border-b border-rule bg-paper pt-4 pb-3">
          <Timeline {...timeline} variant="compact" activeId={activeRole} />
        </div>
        <div data-story-narrative>{children}</div>
      </div>
    </div>
  );
}
