'use client';

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from 'react';

/**
 * Feature 4: pull-quote margin note.
 * Desktop: sits in the right margin column with an accent tick; hover, click, or Enter
 * expands the full text in a popover anchored to the margin (absolute, so no layout shift
 * and never over body text). Mobile: an inline chip under the paragraph; tap to expand.
 * Esc closes and returns focus to the trigger.
 */
export default function MarginNote({ callout, children }: { callout: ReactNode; children: ReactNode }) {
  const popId = useId();
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const open = hovered || pinned;

  const close = useCallback((refocus: boolean) => {
    setHovered(false);
    setPinned(false);
    if (refocus) buttonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close(rootRef.current?.contains(document.activeElement) ?? false);
    };
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open, close]);

  return (
    <div
      ref={rootRef}
      className="relative"
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHovered(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setHovered(false)}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={popId}
        onClick={() => setPinned((p) => !p)}
        className="inline-flex max-w-full items-center gap-2 rounded-full border border-rule px-3 py-1 text-start text-sm leading-snug text-muted transition-colors hover:text-ink aria-expanded:border-accent aria-expanded:text-ink lg:rounded-none lg:border-0 lg:border-s-2 lg:border-accent lg:px-0 lg:py-0.5 lg:ps-3"
      >
        <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent lg:hidden" />
        <span>{callout}</span>
      </button>
      <div
        id={popId}
        role="note"
        hidden={!open}
        className="mt-2 rounded-md border border-rule bg-surface p-3 text-sm leading-relaxed text-ink shadow-sm lg:absolute lg:inset-x-0 lg:top-full lg:z-20"
      >
        {children}
      </div>
    </div>
  );
}
