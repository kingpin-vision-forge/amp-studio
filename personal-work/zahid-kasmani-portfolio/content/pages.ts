import type { Localized } from './types';

export type PageKey = 'home' | 'story' | 'experience' | 'achievements' | 'expertise' | 'credentials' | 'about' | 'contact';

export interface PageCopy {
  /** Path segment after the locale ('' for Home). */
  path: string;
  /** <title>, 50 to 60 characters. */
  title: Localized;
  /** Meta description, 150 to 160 characters. */
  description: Localized;
  h1: Localized;
  /** 2 to 3 sentence plain-language summary that opens the page. */
  summary: Localized;
  /** Short name for breadcrumbs. */
  crumb: Localized;
}

export const pageOrder: PageKey[] = ['home', 'story', 'experience', 'achievements', 'expertise', 'credentials', 'about', 'contact'];

export const pages: Record<PageKey, PageCopy> = {
  home: {
    path: '',
    title: { en: 'Zahid Kasmani | CFO in Kuwait, Finance and Treasury' },
    description: { en: 'Zahid Kasmani, CFO of Central Circle Company in Kuwait. At Mabanee Company: a USD 5B debt portfolio managed and four project financings worth USD 2.75B closed.' },
    h1: { en: 'Zahid Kasmani, CFO in Kuwait' },
    summary: { en: 'Zahid Kasmani is a CFO based in Kuwait and has been CFO of Central Circle Company since August 2022. As CFO of Mabanee Company from 2015 to 2022, Zahid managed a USD 5B debt portfolio, raised USD 1B in new funding, restructured USD 1.5B, and closed four project financings worth USD 2.75B. The career spans more than 30 years in banking, real estate, investments, and financial services in the GCC.' },
    crumb: { en: 'Home' },
  },
  story: {
    path: 'story',
    title: { en: 'Career Story in Three Chapters | Zahid Kasmani, Kuwait' },
    description: { en: 'Three chapters of a Gulf finance career: Chartered Accountant in 1994, CFO of Mabanee Company with a USD 5B debt portfolio, then CFO of Central Circle Company.' },
    h1: { en: 'A finance career in three chapters' },
    summary: { en: 'This is the career of Zahid Kasmani, CFO of Central Circle Company in Kuwait, read as three chapters: Foundations, Scale, and Stewardship. It runs from qualifying as a Chartered Accountant in 1994, through a USD 5B debt portfolio at Mabanee Company, to recurring annual savings exceeding KWD 1M at Central Circle Company.' },
    crumb: { en: 'Story' },
  },
  experience: {
    path: 'experience',
    title: { en: 'CFO Experience in Kuwait, Group Treasury | Zahid Kasmani' },
    description: { en: 'CFO experience in Kuwait since 2005: First Investment Company, AlRajhi Bank, Kuwait International Bank, Mabanee Company, and Central Circle Company, by year.' },
    h1: { en: 'CFO experience in Kuwait and the Gulf' },
    summary: { en: 'Zahid Kasmani has held CFO and finance leadership roles in Kuwait since 2005, and is CFO of Central Circle Company. As CFO of Mabanee Company from 2015 to 2022, Zahid led group treasury and fundraising and managed a USD 5B debt portfolio. Use the timeline and the era filter to move through each role.' },
    crumb: { en: 'Experience' },
  },
  achievements: {
    path: 'achievements',
    title: { en: 'Project Finance in Kuwait and the GCC | Zahid Kasmani' },
    description: { en: 'Project finance in Kuwait and the GCC: four project financings worth USD 2.75B, USD 1.5B restructured, USD 1B raised, and recurring annual savings above KWD 1M.' },
    h1: { en: 'Project finance in Kuwait and the GCC, and other achievements' },
    summary: { en: 'These are the project finance, capital raising, governance, and transformation achievements of Zahid Kasmani, CFO of Central Circle Company in Kuwait. At Mabanee Company, four project financings worth USD 2.75B were closed and USD 1.5B was restructured; at Central Circle Company, process optimization generated recurring annual savings exceeding KWD 1M.' },
    crumb: { en: 'Achievements' },
  },
  expertise: {
    path: 'expertise',
    title: { en: 'Islamic Finance CFO Expertise and Treasury | Zahid Kasmani' },
    description: { en: 'Islamic finance CFO expertise: Islamic banking, sukuk structuring, treasury, capital raising, project finance, Basel III, IFRS, Oracle ERP, and Yardi.' },
    h1: { en: 'Islamic finance CFO expertise' },
    summary: { en: 'Zahid Kasmani is a CFO in Kuwait with expertise in Islamic banking, treasury, capital raising, project finance, and sukuk structuring. The work has spanned conventional and Islamic finance in the Gulf region, with system implementations including Oracle ERP, Yardi, and BI platforms.' },
    crumb: { en: 'Expertise' },
  },
  credentials: {
    path: 'credentials',
    title: { en: 'Chartered Accountant and CMA in Kuwait | Zahid Kasmani' },
    description: { en: 'Chartered Accountant (1994, ranked 28th, All India Rank), CMA (2013), MBA from Bentley University (2015), and the London Business School CFO Programme in 2021.' },
    h1: { en: 'Chartered Accountant and CMA, based in Kuwait' },
    summary: { en: 'Zahid Kasmani, CFO of Central Circle Company in Kuwait, is a Chartered Accountant (1994) and a Certified Management Accountant (2013). Further qualifications include an MBA from Bentley University (2015) and the CFO Programme at London Business School (2021).' },
    crumb: { en: 'Credentials' },
  },
  about: {
    path: 'about',
    title: { en: 'About Zahid Kasmani | CFO Profile, Kuwait and the Gulf' },
    description: { en: 'About Zahid Kasmani: more than 30 years in Gulf banking, real estate, and investments, 20 of them leading finance and treasury. CFO of Central Circle Company.' },
    h1: { en: 'About Zahid Kasmani' },
    summary: { en: 'Zahid Kasmani is the CFO of Central Circle Company in Kuwait, with more than 30 years in banking, real estate, investments, and financial services, twenty of them leading finance and treasury. At Mabanee Company, Zahid managed a USD 5B+ debt portfolio.' },
    crumb: { en: 'About' },
  },
  contact: {
    path: 'contact',
    title: { en: 'Contact Zahid Kasmani | CFO, Central Circle Company Kuwait' },
    description: { en: 'Contact Zahid Kasmani, CFO of Central Circle Company in Kuwait, by email, phone, or LinkedIn. Over 30 years in GCC banking, real estate, and investments.' },
    h1: { en: 'Contact Zahid Kasmani' },
    summary: { en: 'Zahid Kasmani is CFO of Central Circle Company and is based in Kuwait. Reach Zahid by email, phone, or LinkedIn.' },
    crumb: { en: 'Contact' },
  },
};
