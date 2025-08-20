import { ApiProperty } from '@nestjs/swagger';
import { ProfessionSkillCosts } from 'src/modules/professions/domain/entities/profession.entity';

export class ProfessionSkillCostsDto {
  @ApiProperty({ description: 'Animal skill costs', example: [2, 4] })
  animal: number[];

  @ApiProperty({ description: 'Awareness skill costs', example: [2, 4] })
  awareness: number[];

  @ApiProperty({ description: 'Battle expertise skill costs', example: [2, 4] })
  battleExpertise: number[];

  @ApiProperty({ description: 'Body discipline skill costs', example: [2, 4] })
  bodyDiscipline: number[];

  @ApiProperty({ description: 'Brawn skill costs', example: [2, 4] })
  brawn: number[];

  @ApiProperty({ description: 'Combat expertise skill costs', example: [2, 4] })
  combatExpertise: number[];

  @ApiProperty({ description: 'Combat skill 1 costs', example: [2, 4] })
  combat1: number[];

  @ApiProperty({ description: 'Combat skill 2 costs', example: [2, 4] })
  combat2: number[];

  @ApiProperty({ description: 'Combat skill 3 costs', example: [2, 4] })
  combat3: number[];

  @ApiProperty({ description: 'Combat skill 4 costs', example: [2, 4] })
  combat4: number[];

  @ApiProperty({ description: 'Composition skill costs', example: [2, 4] })
  composition: number[];

  @ApiProperty({ description: 'Crafting skill costs', example: [2, 4] })
  crafting: number[];

  @ApiProperty({ description: 'Delving skill costs', example: [2, 4] })
  delving: number[];

  @ApiProperty({ description: 'Environmental skill costs', example: [2, 4] })
  environmental: number[];

  @ApiProperty({ description: 'Gymnastic skill costs', example: [2, 4] })
  gymnastic: number[];

  @ApiProperty({ description: 'Lore skill costs', example: [2, 4] })
  lore: number[];

  @ApiProperty({ description: 'Magical expertise skill costs', example: [2, 4] })
  magicalExpertise: number[];

  @ApiProperty({ description: 'Medical skill costs', example: [2, 4] })
  medical: number[];

  @ApiProperty({ description: 'Mental discipline skill costs', example: [2, 4] })
  mentalDiscipline: number[];

  @ApiProperty({ description: 'Movement skill costs', example: [2, 4] })
  movement: number[];

  @ApiProperty({ description: 'Performance art skill costs', example: [2, 4] })
  performanceArt: number[];

  @ApiProperty({ description: 'Power manipulation skill costs', example: [2, 4] })
  powerManipulation: number[];

  @ApiProperty({ description: 'Science skill costs', example: [2, 4] })
  science: number[];

  @ApiProperty({ description: 'Social skill costs', example: [2, 4] })
  social: number[];

  @ApiProperty({ description: 'Spells base open skill costs', example: [2, 4] })
  spellsBaseOpen: number[];

  @ApiProperty({ description: 'Spells ritual magic skill costs', example: [2, 4] })
  spellsRitualMagic: number[];

  @ApiProperty({ description: 'Closed skill costs', example: [2, 4] })
  spellsClosed: number[];

  @ApiProperty({ description: 'Arcane skill costs', example: [2, 4] })
  spellsArcane: number[];

  @ApiProperty({ description: 'Restricted skill costs', example: [2, 4] })
  spellsRestricted: number[];

  @ApiProperty({ description: 'Subterfuge skill costs', example: [2, 4] })
  subterfuge: number[];

  @ApiProperty({ description: 'Technical skill costs', example: [2, 4] })
  technical: number[];

  @ApiProperty({ description: 'Vocation skill costs', example: [2, 4] })
  vocation: number[];

  static fromEntity(entity: ProfessionSkillCosts): ProfessionSkillCostsDto {
    return { ...entity };
  }
}
