/** Media queries shared by every gsap.matchMedia() call. */
export const MOTION_OK = '(prefers-reduced-motion: no-preference)';
export const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
export const DESKTOP = '(min-width: 1024px)';

export const EASE_OUT = 'power2.out';
export const EASE_IN_OUT = 'power1.inOut';

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia(REDUCED_MOTION).matches;
}

/** Native scroll; smooth only when motion is allowed. */
export function scrollToId(id: string, focus = true): void {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
  if (focus) {
    const target = el.matches('[tabindex]') ? el : el.querySelector<HTMLElement>('[tabindex="-1"]') ?? el;
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }
  history.replaceState(null, '', `${location.pathname}${location.search}#${id}`);
}
