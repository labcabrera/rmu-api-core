import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsOptional } from 'class-validator';
import type { ProfessionSkillCosts } from '../../../domain/value-objects/profession-skill-cost.vo.js';

/**
 * Development point costs by skill category. Every category is optional; when present it is a list of integers
 * (one cost per rank bought in the same level).
 */
export class ProfessionSkillCostsDto {
  @ApiProperty({ required: false, description: 'Animal skill costs', example: [2, 4] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  animal: number[];

  @ApiProperty({ required: false, description: 'Awareness skill costs', example: [2, 4] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  awareness: number[];

  @ApiProperty({ required: false, description: 'Battle expertise skill costs', example: [2, 4] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  'battle-expertise': number[];

  @ApiProperty({ required: false, description: 'Body discipline skill costs', example: [2, 4] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  'body-discipline': number[];

  @ApiProperty({ required: false, description: 'Brawn skill costs', example: [2, 4] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  brawn: number[];

  @ApiProperty({ required: false, description: 'Combat expertise skill costs', example: [2, 4] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  'combat-expertise': number[];

  @ApiProperty({ required: false, description: 'Combat skill 1 costs', example: [2, 4] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  combat1: number[];

  @ApiProperty({ required: false, description: 'Combat skill 2 costs', example: [2, 4] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  combat2: number[];

  @ApiProperty({ required: false, description: 'Combat skill 3 costs', example: [2, 4] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  combat3: number[];

  @ApiProperty({ required: false, description: 'Combat skill 4 costs', example: [2, 4] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  combat4: number[];

  @ApiProperty({ required: false, description: 'Composition skill costs', example: [2, 4] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  composition: number[];

  @ApiProperty({ required: false, description: 'Crafting skill costs', example: [2, 4] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  crafting: number[];

  @ApiProperty({ required: false, description: 'Delving skill costs', example: [2, 4] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  delving: number[];

  @ApiProperty({ required: false, description: 'Environmental skill costs', example: [2, 4] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  environmental: number[];

  @ApiProperty({ required: false, description: 'Gymnastic skill costs', example: [2, 4] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  gymnastic: number[];

  @ApiProperty({ required: false, description: 'Lore skill costs', example: [2, 4] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  lore: number[];

  @ApiProperty({ required: false, description: 'Magical expertise skill costs', example: [2, 4] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  'magical-expertise': number[];

  @ApiProperty({ required: false, description: 'Medical skill costs', example: [2, 4] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  medical: number[];

  @ApiProperty({ required: false, description: 'Mental discipline skill costs', example: [2, 4] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  'mental-discipline': number[];

  @ApiProperty({ required: false, description: 'Movement skill costs', example: [2, 4] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  movement: number[];

  @ApiProperty({ required: false, description: 'Performance art skill costs', example: [2, 4] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  'performance-art': number[];

  @ApiProperty({ required: false, description: 'Power manipulation skill costs', example: [2, 4] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  'power-manipulation': number[];

  @ApiProperty({ required: false, description: 'Science skill costs', example: [2, 4] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  science: number[];

  @ApiProperty({ required: false, description: 'Social skill costs', example: [2, 4] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  social: number[];

  @ApiProperty({ required: false, description: 'Spells base open skill costs', example: [2, 4] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  'spells-base-open': number[];

  @ApiProperty({ required: false, description: 'Spells ritual magic skill costs', example: [2, 4] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  'spells-ritual-magic': number[];

  @ApiProperty({ required: false, description: 'Closed skill costs', example: [2, 4] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  'spells-closed': number[];

  @ApiProperty({ required: false, description: 'Arcane skill costs', example: [2, 4] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  'spells-arcane': number[];

  @ApiProperty({ required: false, description: 'Restricted skill costs', example: [2, 4] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  'spells-restricted': number[];

  @ApiProperty({ required: false, description: 'Subterfuge skill costs', example: [2, 4] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  subterfuge: number[];

  @ApiProperty({ required: false, description: 'Technical skill costs', example: [2, 4] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  technical: number[];

  @ApiProperty({ required: false, description: 'Vocation skill costs', example: [2, 4] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  vocation: number[];

  static fromEntity(entity: ProfessionSkillCosts): ProfessionSkillCostsDto {
    return {
      animal: entity.animal,
      awareness: entity.awareness,
      'battle-expertise': entity['battle-expertise'],
      'body-discipline': entity['body-discipline'],
      brawn: entity.brawn,
      'combat-expertise': entity['combat-expertise'],
      combat1: entity.combat1,
      combat2: entity.combat2,
      combat3: entity.combat3,
      combat4: entity.combat4,
      composition: entity.composition,
      crafting: entity.crafting,
      delving: entity.delving,
      environmental: entity.environmental,
      gymnastic: entity.gymnastic,
      lore: entity.lore,
      'magical-expertise': entity['magical-expertise'],
      medical: entity.medical,
      'mental-discipline': entity['mental-discipline'],
      movement: entity.movement,
      'performance-art': entity['performance-art'],
      'power-manipulation': entity['power-manipulation'],
      science: entity.science,
      social: entity.social,
      'spells-base-open': entity['spells-base-open'],
      'spells-ritual-magic': entity['spells-ritual-magic'],
      'spells-closed': entity['spells-closed'],
      'spells-arcane': entity['spells-arcane'],
      'spells-restricted': entity['spells-restricted'],
      subterfuge: entity.subterfuge,
      technical: entity.technical,
      vocation: entity.vocation,
    };
  }
}
