import { Skill } from '@domain/entities/Game';

export const skills: Skill[] = [
  {
    id: 'animal-handling',
    name: 'Animal Handling',
    category: 'animal',
    description: 'Handle and train animals',
    stat1: 'pr',
  },
  {
    id: 'riding',
    name: 'Riding',
    category: 'animal',
    description: 'Ride various animals',
    stat1: 'pr',
  },

  {
    id: 'perception',
    name: 'Perception',
    category: 'awareness',
    description: 'Notice things in the environment',
    stat1: 'sd',
  },
  {
    id: 'tracking',
    name: 'Tracking',
    category: 'awareness',
    description: 'Follow tracks and signs',
    stat1: 'sd',
  },

  {
    id: 'armor-maneuver',
    name: 'Armor Maneuver',
    category: 'battle-expertise',
    description: 'Move effectively in armor',
  },
  {
    id: 'mounted-combat',
    name: 'Mounted Combat',
    category: 'battle-expertise',
    description: 'Fight while mounted',
  },
  {
    id: 'protect',
    name: 'Protect',
    category: 'battle-expertise',
    description: 'Protect others in combat',
  },
  {
    id: 'restricted-quarters',
    name: 'Restricted Quarters',
    category: 'battle-expertise',
    description: 'Fight in confined spaces',
  },
  {
    id: 'subduing',
    name: 'Subduing',
    category: 'battle-expertise',
    description: 'Subdue opponents non-lethally',
  },

  {
    id: 'adrenal-maneuvers',
    name: 'Adrenal Maneuvers',
    category: 'body-discipline',
    description: 'Advanced physical techniques',
  },
  {
    id: 'adrenal-defense',
    name: 'Adrenal Defense',
    category: 'body-discipline',
    description: 'Enhanced defensive abilities',
    stat1: 'ag',
  },
  {
    id: 'adrenal-focus',
    name: 'Adrenal Focus',
    category: 'body-discipline',
    description: 'Enhanced mental focus',
    stat1: 'sd',
  },
  {
    id: 'adrenal-speed',
    name: 'Adrenal Speed',
    category: 'body-discipline',
    description: 'Enhanced speed',
    stat1: 'qu',
  },
  {
    id: 'adrenal-strength',
    name: 'Adrenal Strength',
    category: 'body-discipline',
    description: 'Enhanced strength',
    stat1: 'st',
  },

  {
    id: 'body-development',
    name: 'Body Development',
    category: 'brawn',
    description: 'Physical conditioning',
    stat1: 'co',
  },
];
