import type { Lens, Localized } from './types';

/** Interface copy. Every visible label lives here, never in components. */
export const ui = {
  skipToContent: { en: 'Skip to content' },
  primaryNav: { en: 'Primary' },
  breadcrumb: { en: 'Breadcrumb' },
  nav: {
    home: { en: 'Home' },
    story: { en: 'Story' },
    experience: { en: 'Experience' },
    achievements: { en: 'Achievements' },
    expertise: { en: 'Expertise' },
    credentials: { en: 'Credentials' },
    about: { en: 'About' },
    contact: { en: 'Contact' },
  },
  localeToggle: {
    toEnglish: { en: 'English' },
    toArabic: { en: 'العربية' },
    arabicPending: { en: 'العربية (قريباً)' },
    arabicPendingHint: { en: 'Arabic version in preparation' },
  },
  eraFilter: {
    legend: { en: 'Filter by era' },
    all: { en: 'All' },
    unattributedNote: { en: 'Highlights from across the career.' },
  },
  timeline: {
    label: { en: 'Career timeline, 2001 to present' },
    earlierGroup: { en: 'Earlier banking and investment roles' },
    present: { en: 'present' },
    to: { en: 'to' },
  },
  marginNote: {
    close: { en: 'Close note' },
  },
  progressRail: {
    label: { en: 'Chapters' },
  },
  keyFigures: { en: 'Key figures' },
  chaptersHeading: { en: 'The story in three chapters' },
  readChapter: { en: 'Read the chapter' },
  footer: {
    linkedin: { en: 'LinkedIn' },
    email: { en: 'Email' },
  },
  contact: {
    location: { en: 'Location' },
    phone: { en: 'Phone' },
    email: { en: 'Email' },
    linkedin: { en: 'LinkedIn' },
  },
  credentials: {
    education: { en: 'Education and qualifications' },
    training: { en: 'Training' },
  },
  expertise: {
    technicalSkills: { en: 'Technical skills' },
  },
  about: {
    executiveSummary: { en: 'Executive summary' },
    executiveProfile: { en: 'Executive profile' },
    qualifications: { en: 'Qualifications' },
    areas: { en: 'Areas of practice' },
    currentRole: { en: 'Current role' },
  },
  roleCard: {
    from: { en: 'from' },
  },
} satisfies Record<string, unknown>;

export const lensOrder: Lens[] = ['capital', 'governance', 'transformation', 'operations', 'people'];

export const lensNames: Record<Lens, Localized> = {
  capital: { en: 'Capital Structuring and Fundraising' },
  governance: { en: 'Governance and Risk' },
  transformation: { en: 'Digital Finance Transformation' },
  operations: { en: 'Strategy and Operations' },
  people: { en: 'People' },
};

/**
 * Subject areas named in the Person JSON-LD (`knowsAbout`).
 * Rendered on About so the structured data mirrors visible content.
 */
export const knowsAbout: string[] = [
  'Corporate finance', 'Treasury', 'Islamic finance', 'Project finance', 'Sukuk',
  'Capital raising', 'Debt restructuring', 'Credit ratings', 'M&A', 'Basel III',
  'IFRS', 'ERP implementation', 'Business intelligence',
];

/** Typographic Open Graph card: name, title, one figure. */
export const ogCard = {
  alt: { en: 'Zahid Kasmani, CFO, Central Circle Company' },
  title: { en: 'CFO, Central Circle Company' },
  place: { en: 'Kuwait' },
};
