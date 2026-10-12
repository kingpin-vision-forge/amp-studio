export type Status = 'confirmed' | 'verify' | 'unattributed';
export type Lens = 'capital' | 'governance' | 'transformation' | 'operations' | 'people';
export type EraId = 'e1' | 'e5' | 'e2' | 'e3' | 'e4';
export interface Localized { en: string; ar?: string; }
export interface Bullet {
  id: string;
  text: Localized;
  callout: Localized;
  lens: Lens[];
  status: Status;
}

/* Structural types for the remaining content files. */

export interface Era { id: EraId; label: Localized; }

export interface KeyFigure { value: string; label: Localized; ref: string; }

export interface SummaryCallout { para: number; callout: Localized; text: Localized; }

export interface Profile {
  name: Localized;
  credentials: Localized;
  headline: Localized;
  currentRole: Localized;
  hero: Localized;
  keyFigures: KeyFigure[];
  executiveSummary: Localized[];
  summaryCallouts: SummaryCallout[];
  executiveProfile: Localized;
}

export interface Role {
  id: string;
  employer: string;
  title: string;
  /** YYYY-MM */
  start: string;
  /** YYYY-MM or 'present' */
  end: string;
  era: EraId;
  summary: Localized | null;
  bullets: Bullet[];
}

export type Highlight = Bullet;

export interface ExpertiseGroup { group: Localized; items: string[]; }

export interface EducationItem { title: string; institution?: string; note?: string; year?: string; }

export interface Contact {
  address: string;
  addressShort: string;
  phone: string;
  email: string;
  linkedin: string;
}
