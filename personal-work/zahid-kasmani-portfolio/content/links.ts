import type { StoryLink } from './story';

/** Descriptive internal links between Story, Experience, and Achievements. */
export const experienceLinks: StoryLink[] = [
  { label: { en: 'Read the career as a story, chapter by chapter' }, page: 'story' },
  { label: { en: 'See the project finance and capital raising achievements' }, page: 'achievements', hash: 'lens-capital' },
];

export const achievementsLinks: StoryLink[] = [
  { label: { en: 'See the Mabanee project financings in context' }, page: 'experience', hash: 'role-mabanee' },
  { label: { en: 'Read how the Scale chapter unfolded' }, page: 'story', hash: 'chapter-scale' },
];

export const expertiseLinks: StoryLink[] = [
  { label: { en: 'See where this expertise was applied, role by role' }, page: 'experience' },
  { label: { en: 'Read the credentials behind it' }, page: 'credentials' },
];
