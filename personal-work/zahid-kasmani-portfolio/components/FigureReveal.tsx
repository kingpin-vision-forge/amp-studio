'use client';

import { gsap, ScrollTrigger, useGSAP } from '@/lib/animations/gsap';
import { EASE_OUT, MOTION_OK } from '@/lib/animations/media';

/**
 * Feature 1: scroll-triggered number reveal.
 * Figures are final text in the HTML; with JS and motion allowed they fade and rise 10px
 * once, when the paragraph that explains them reaches 75% of the viewport.
 */
export default function FigureReveal() {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const figures = gsap.utils.toArray<HTMLElement>('[data-reveal-figure]');
      figures.forEach((el) => {
        const trigger = el.closest<HTMLElement>('[data-reveal-trigger]') ?? el;
        // Anything already on screen at load stays put: no flash, no LCP delay.
        if (ScrollTrigger.isInViewport(trigger, 0.01)) return;
        gsap.set(el, { autoAlpha: 0, y: 10 });
        ScrollTrigger.create({
          trigger,
          start: 'top 75%',
          once: true,
          onEnter: () => gsap.to(el, { autoAlpha: 1, y: 0, duration: 0.5, ease: EASE_OUT }),
        });
      });
    });
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => mm.revert();
  });
  return null;
}
