import { ApiProperty } from '@nestjs/swagger';
import {
  FIGHTING_STYLE_SKILLS,
  type FightingStyleCatalog,
  type FightingStyleSkill,
  STYLE_ABILITY_TYPES,
  STYLE_CONDITION_KINDS,
  type StyleAbilityType,
  type StyleConditionKind,
} from '../../../domain/value-objects/fighting-styles.vo.js';

export class StyleConditionDto {
  @ApiProperty({ type: String, enum: STYLE_CONDITION_KINDS, example: 'weapon-skill' })
  kind: StyleConditionKind;

  @ApiProperty({ required: false, description: 'Value of the condition', example: 'melee-weapon@pole-arm' })
  value?: string;
}

export class StyleAbilityDto {
  @ApiProperty({ example: 'lightning-reflexes' })
  id: string;

  @ApiProperty({ type: [String], enum: STYLE_ABILITY_TYPES, description: 'Style categories that may grant it' })
  types: StyleAbilityType[];

  @ApiProperty({ description: 'It can be selected several times' })
  repeatable: boolean;

  @ApiProperty({ type: Number, nullable: true, description: 'Times it can be selected; null is no limit' })
  maxTimes: number | null;

  @ApiProperty({ type: [String], description: 'Abilities of the style that must be selected first' })
  requiresAbilities: string[];

  @ApiProperty({ type: [String], description: 'Skills the character needs ranks in', example: ['fortitude'] })
  requiresSkills: string[];

  @ApiProperty({ type: [String], description: 'Talents the character needs', example: ['frenzy'] })
  requiresTraits: string[];

  @ApiProperty({
    description: 'Alternatives of equipment conditions (any alternative, every condition of it); empty is none',
    type: 'array',
    items: { type: 'array', items: { $ref: '#/components/schemas/StyleConditionDto' } },
  })
  equipment: StyleConditionDto[][];
}

export class FightingStyleAbilityDto {
  @ApiProperty({ example: 'off-hand-dagger' })
  abilityId: string;

  @ApiProperty({ description: 'Ranks of the style it costs', example: 2 })
  cost: number;
}

export class FightingStyleDto {
  @ApiProperty({ description: 'Specialization of the style skill', example: 'fencing' })
  id: string;

  @ApiProperty({ type: String, enum: FIGHTING_STYLE_SKILLS, example: 'combat-styles' })
  skillId: FightingStyleSkill;

  @ApiProperty({ type: [FightingStyleAbilityDto] })
  abilities: FightingStyleAbilityDto[];

  @ApiProperty({ type: [String], description: 'Skills the character needs ranks in' })
  requiresSkills: string[];

  @ApiProperty({ type: [String], description: 'Talents the character needs' })
  requiresTraits: string[];

  @ApiProperty({
    description: 'Alternatives of equipment conditions (any alternative, every condition of it); empty is none',
    type: 'array',
    items: { type: 'array', items: { $ref: '#/components/schemas/StyleConditionDto' } },
  })
  equipment: StyleConditionDto[][];
}

export class FightingStylesDto {
  @ApiProperty({ type: [FightingStyleDto] })
  styles: FightingStyleDto[];

  @ApiProperty({ type: [StyleAbilityDto] })
  abilities: StyleAbilityDto[];

  static fromEntity(entity: FightingStyleCatalog): FightingStylesDto {
    return Object.assign(new FightingStylesDto(), entity);
  }
}
