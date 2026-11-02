/**
 * The talent and flaw categories: the sections of Core Law chapter 4 (Combat ... Other), plus the Character Companion
 * social contacts and status, wealth and epic talents, and its mental and special flaws (spec 039).
 */
export type TraitCategory =
  'combat' | 'discipline' | 'magical' | 'physical' | 'racial' | 'senses' | 'other' | 'social' | 'wealth' | 'epic' | 'mental' | 'special';

export const TRAIT_CATEGORIES: TraitCategory[] = [
  'combat',
  'discipline',
  'magical',
  'physical',
  'racial',
  'senses',
  'other',
  'social',
  'wealth',
  'epic',
  'mental',
  'special',
];
