import type { Localized } from './types';

export type ChapterId = 'foundations' | 'scale' | 'stewardship';

export interface IntroSentence {
  text: Localized;
  /** Bullet id this sentence depends on; dropped when that bullet is hidden. */
  requires?: string;
}

export interface StoryLink { label: Localized; page: 'experience' | 'achievements' | 'credentials' | 'story' | 'expertise' | 'about' | 'contact'; hash?: string; }

export interface Chapter {
  id: ChapterId;
  title: Localized;
  span: Localized;
  intro: IntroSentence[];
  /** Role ids, in reading order. */
  roles: string[];
  showQualifications?: boolean;
  showEarlierFirms?: boolean;
  links: StoryLink[];
}

/** Qualifications referenced in Chapter 1, by education title. */
export const foundationQualifications = ['B.Com', 'Cost & Management Accountant (ACWA)', 'Chartered Accountant'];

export const chapters: Chapter[] = [
  {
    id: 'foundations',
    title: { en: 'Foundations' },
    span: { en: '1992 to 2010' },
    intro: [
      { text: { en: 'The foundations were laid in India: a B.Com from Mumbai University in 1992, the ACWA qualification in 1993, and qualification as a Chartered Accountant in 1994, ranked 28th in the All India Rank on the first attempt.' } },
      { text: { en: 'The years that followed were spent in Gulf banking and investment: Gulf Bank in Kuwait from 2001, CFO of First Investment Company from 2005, and Financial Controller (CFO) of AlTanmya International Investment Co. from 2008, alongside earlier roles at international banks.' } },
    ],
    roles: ['gulf-bank', 'first-investment', 'altanmya'],
    showQualifications: true,
    showEarlierFirms: true,
    links: [
      { label: { en: 'See every qualification and certification' }, page: 'credentials' },
    ],
  },
  {
    id: 'scale',
    title: { en: 'Scale' },
    span: { en: '2010 to 2022' },
    intro: [
      { text: { en: 'In 2010 the role became Finance Manager (CFO) at AlRajhi Bank, Kuwait, and in 2011 AGM, Finance and Acting CFO at Kuwait International Bank, where a double credit rating upgrade from A- to A+ was negotiated.' } },
      { text: { en: 'From 2015 to 2022, as CFO of Mabanee Company, the work included a USD 5B debt portfolio, USD 1B in new funding, USD 1.5B restructured, and four project financings worth USD 2.75B.' } },
      { text: { en: 'SAR 10B of non-recourse project financing was also secured.' }, requires: 'mab-sar' },
    ],
    roles: ['alrajhi', 'kib', 'mabanee'],
    links: [
      { label: { en: 'See the Mabanee project financings' }, page: 'experience', hash: 'role-mabanee' },
      { label: { en: 'Read the capital structuring and fundraising achievements' }, page: 'achievements', hash: 'lens-capital' },
    ],
  },
  {
    id: 'stewardship',
    title: { en: 'Stewardship' },
    span: { en: '2022 to present' },
    intro: [
      { text: { en: 'Since August 2022, as CFO of Central Circle Company, the work has been leading finance, treasury, investments, and fundraising for group operations across multiple subsidiaries.' } },
      { text: { en: 'A first-of-its-kind debt platform in the region closed two transactions.' }, requires: 'cc-debt-platform' },
      { text: { en: 'Finance transformation through enhanced systems, controls, and reporting, with process optimization, has generated recurring annual savings exceeding KWD 1M.' } },
    ],
    roles: ['central-circle'],
    links: [
      { label: { en: 'See the Central Circle role on the timeline' }, page: 'experience', hash: 'role-central-circle' },
      { label: { en: 'Read the digital finance transformation achievements' }, page: 'achievements', hash: 'lens-transformation' },
    ],
  },
];
