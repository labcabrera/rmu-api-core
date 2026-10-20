import { CultureSkillRank } from '../value-objects/culture-skill-rank';

/**
 * Development point cost per rank of each skill category when building a culture (Core Law §12.6).
 * Rules values keyed by the skill category ids of the skill-categories catalog.
 */
export const CULTURE_DEVELOPMENT_COST_BY_CATEGORY: Readonly<Record<string, number>> = {
  animal: 2,
  awareness: 2,
  brawn: 3,
  'battle-expertise': 3,
  'combat-training': 4,
  composition: 2,
  'performance-art': 2,
  crafting: 2,
  vocation: 2,
  environmental: 3,
  gymnastic: 3,
  lore: 1,
  medical: 3,
  movement: 2,
  social: 2,
  subterfuge: 3,
};

/** Cost of any category missing from the table, and of skills whose category is unknown. */
export const DEFAULT_CULTURE_DEVELOPMENT_COST = 3;

/** Category used to cost the 'languages' entries. */
export const CULTURE_LANGUAGES_CATEGORY_ID = 'lore';

/** Resolves the category of a skill, or undefined when the skill is not in the catalog. */
export type SkillCategoryResolver = (skillId: string) => string | undefined;

export function cultureCategoryCost(categoryId: string | undefined): number {
  if (!categoryId) return DEFAULT_CULTURE_DEVELOPMENT_COST;
  return CULTURE_DEVELOPMENT_COST_BY_CATEGORY[categoryId] ?? DEFAULT_CULTURE_DEVELOPMENT_COST;
}

/** Cost per rank of one entry. Entries with several skills or categories use the highest cost. */
export function cultureSkillRankUnitCost(entry: CultureSkillRank, resolveCategory: SkillCategoryResolver): number {
  switch (entry.type) {
    case 'skill':
    case 'region':
      return cultureCategoryCost(entry.skillId ? resolveCategory(entry.skillId) : undefined);
    case 'skill-choice':
      return maxCost((entry.skillIds ?? []).map(skillId => cultureCategoryCost(resolveCategory(skillId))));
    case 'category-pool':
      return maxCost((entry.categoryIds ?? []).map(categoryId => cultureCategoryCost(categoryId)));
    case 'languages':
      return cultureCategoryCost(CULTURE_LANGUAGES_CATEGORY_ID);
    default:
      return DEFAULT_CULTURE_DEVELOPMENT_COST;
  }
}

/** Indicative development cost of a culture: the sum of ranks × cost per rank of every entry. */
export function cultureDevelopmentCost(skillRanks: CultureSkillRank[], resolveCategory: SkillCategoryResolver): number {
  return skillRanks.reduce((total, entry) => total + entry.ranks * cultureSkillRankUnitCost(entry, resolveCategory), 0);
}

function maxCost(costs: number[]): number {
  return costs.length > 0 ? Math.max(...costs) : DEFAULT_CULTURE_DEVELOPMENT_COST;
}
