import { siteConfig } from '@/site.config';
import { roles } from '@/content/roles';
import { highlights } from '@/content/highlights';
import { profile } from '@/content/profile';
import { education } from '@/content/education';
import { expertiseLenses } from '@/content/expertise';
import type { Chapter } from '@/content/story';
import type { Bullet, EraId, KeyFigure, Lens, Localized, Role } from '@/content/types';

/** Items marked 'verify' are hidden when siteConfig.hideVerifyItems is true. */
export function isShown(item: { status: Bullet['status'] }): boolean {
  return !(siteConfig.hideVerifyItems && item.status === 'verify');
}

export function shownBullets(role: Role): Bullet[] {
  return role.bullets.filter(isShown);
}

export function getRole(id: string): Role {
  const role = roles.find((r) => r.id === id);
  if (!role) throw new Error(`Unknown role id: ${id}`);
  return role;
}

export interface BulletRef { bullet: Bullet; role: Role; }

const bulletIndex = new Map<string, BulletRef>();
for (const role of roles) for (const bullet of role.bullets) bulletIndex.set(bullet.id, { bullet, role });

export function findBullet(id: string): BulletRef | undefined {
  return bulletIndex.get(id);
}

/** Key figures whose source bullet is currently shown. */
export function shownKeyFigures(): (KeyFigure & BulletRef)[] {
  return profile.keyFigures.flatMap((kf) => {
    const ref = bulletIndex.get(kf.ref);
    return ref && isShown(ref.bullet) ? [{ ...kf, ...ref }] : [];
  });
}

/** Key figure value keyed by bullet id, for inline figures beside their paragraph. */
export function keyFigureFor(bulletId: string): KeyFigure | undefined {
  return profile.keyFigures.find((kf) => kf.ref === bulletId);
}

export function chapterIntro(chapter: Chapter) {
  return chapter.intro.filter((s) => {
    if (!s.requires) return true;
    const ref = bulletIndex.get(s.requires);
    return ref ? isShown(ref.bullet) : false;
  });
}

/** Join sentences into one localized field, so a fallback renders as a single isolated run. */
export function joinLocalized(parts: Localized[]): Localized {
  const en = parts.map((p) => p.en).join(' ');
  return parts.every((p) => p.ar) ? { en, ar: parts.map((p) => p.ar).join(' ') } : { en };
}

export function shownHighlights() {
  return highlights.filter(isShown);
}

/** Lenses that have at least one shown, era-attributed bullet in each era. */
export function lensesByEra(): Record<EraId, Lens[]> {
  const out: Record<EraId, Lens[]> = { e1: [], e5: [], e2: [], e3: [], e4: [] };
  for (const role of roles) {
    const set = new Set(out[role.era]);
    for (const b of shownBullets(role)) b.lens.forEach((l) => set.add(l));
    out[role.era] = [...set];
  }
  return out;
}

export function expertiseGroupLenses(index: number): Lens[] {
  return expertiseLenses[index] ?? [];
}

export function educationByTitle(title: string) {
  return education.find((e) => e.title === title);
}

/* Dates */

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function formatMonth(ym: string): string {
  const [y, m] = ym.split('-');
  return `${MONTHS[Number(m) - 1]} ${y}`;
}

export function roleDates(role: Role, presentLabel: string, toLabel: string): string {
  const end = role.end === 'present' ? presentLabel : formatMonth(role.end);
  return `${formatMonth(role.start)} ${toLabel} ${end}`;
}

/** Short organization name derived verbatim from the employer string. */
export function shortEmployer(employer: string): string {
  return employer.split(',')[0]!.replace(/\s*\(.*\)\s*/, '').trim();
}

export { monthIndex } from './dates';
