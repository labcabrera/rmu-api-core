/** Skills whose specializations are the fighting styles (Character Companion §4.2). */
export const FIGHTING_STYLE_SKILLS = ['battle-styles', 'combat-styles', 'discipline-styles'] as const;
export type FightingStyleSkill = (typeof FIGHTING_STYLE_SKILLS)[number];

/** Style categories an ability belongs to; 'any' fits every style. */
export const STYLE_ABILITY_TYPES = ['battle', 'combat', 'discipline', 'any'] as const;
export type StyleAbilityType = (typeof STYLE_ABILITY_TYPES)[number];

/**
 * What the wielder must carry or be for a style or an ability to work. The game reads them with the actor's attacks:
 * - `weapon-skill`: weapon of that skill (`melee-weapon@pole-arm`; a skill without specialization matches all of them);
 * - `weapon-tag`: weapon type with that tag in the items catalog (chain, fencing, quarterstaff...);
 * - `weapon-category`: `dagger` or `light` (size adjustment below 0);
 * - `two-handed`, `one-handed`, `two-weapons`, `single-weapon`, `melee`, `ranged`;
 * - `shield`, `no-shield`, `max-shield` (value: largest shield allowed), `max-armor` (value: highest AT allowed);
 * - `unarmed` (value: strikes, sweeps or wrestling, optional);
 * - `mounted`, `leadership`: the game cannot tell, so it only warns.
 */
export const STYLE_CONDITION_KINDS = [
  'weapon-skill',
  'weapon-tag',
  'weapon-category',
  'two-handed',
  'one-handed',
  'two-weapons',
  'single-weapon',
  'melee',
  'ranged',
  'shield',
  'no-shield',
  'max-shield',
  'max-armor',
  'unarmed',
  'mounted',
  'leadership',
] as const;
export type StyleConditionKind = (typeof STYLE_CONDITION_KINDS)[number];

export interface StyleCondition {
  kind: StyleConditionKind;
  value?: string;
}

/** Alternatives of conditions: met when every condition of any alternative holds. Empty means no requirement. */
export type StyleEquipment = StyleCondition[][];

/** An ability that styles can grant. Its effect is code of the APIs that apply it, found by id. */
export interface StyleAbility {
  id: string;
  types: StyleAbilityType[];
  /** It can be selected several times, up to `maxTimes` (null: no limit). */
  repeatable: boolean;
  maxTimes: number | null;
  /** Abilities of the same style that must be selected first. */
  requiresAbilities: string[];
  /** Skills (`skillId` or `skillId@specialization`) the character needs ranks in. */
  requiresSkills: string[];
  /** Talents the character needs. */
  requiresTraits: string[];
  equipment: StyleEquipment;
}

/** An ability of a style with the ranks it costs in that style. */
export interface FightingStyleAbility {
  abilityId: string;
  cost: number;
}

export interface FightingStyle {
  /** Specialization of the style skill (`fencing` in `combat-styles@fencing`). */
  id: string;
  skillId: FightingStyleSkill;
  abilities: FightingStyleAbility[];
  requiresSkills: string[];
  requiresTraits: string[];
  equipment: StyleEquipment;
}

/**
 * Fighting styles and their abilities. The values come from the rulebook and are imported from the gitignored data
 * directory (data/character-companion/fighting-styles.json), never written in code.
 */
export interface FightingStyleCatalog {
  styles: FightingStyle[];
  abilities: StyleAbility[];
}
