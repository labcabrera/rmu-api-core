import { ApiProperty } from '@nestjs/swagger';
import { DIFFICULTY_KEYS, type DifficultyKey } from '../../../../healing-tables/domain/value-objects/healing-tables.vo.js';
import type { SkillDifficultyGuide } from '../../../domain/value-objects/skill-difficulty-guide.vo.js';

export class LocalizedTextDto {
  @ApiProperty({ description: 'English text, as in the rulebook' })
  en: string;

  @ApiProperty({ description: 'Spanish translation', required: false })
  es?: string;
}

export class DifficultyExampleDto {
  @ApiProperty({ type: String, enum: DIFFICULTY_KEYS, description: 'Maneuver difficulty key (Table 5-1)', example: 'h' })
  difficulty: DifficultyKey;

  @ApiProperty({ type: LocalizedTextDto })
  text: LocalizedTextDto;
}

export class SkillDifficultyGuideDto {
  @ApiProperty({ description: 'Skill id, or general for the general scale', example: 'climbing' })
  skillId: string;

  @ApiProperty({ type: LocalizedTextDto, required: false, description: 'What the examples are about, when the book says it' })
  context?: LocalizedTextDto;

  @ApiProperty({ required: false, description: 'Skill whose examples this one repeats', example: 'adrenal-defense' })
  sharedWith?: string;

  @ApiProperty({ type: [DifficultyExampleDto], description: 'Examples from the easiest difficulty to the hardest' })
  examples: DifficultyExampleDto[];

  @ApiProperty({ description: 'True when the skill has no examples and the general scale is returned', example: false })
  fallback: boolean;

  static fromEntity(entity: SkillDifficultyGuide): SkillDifficultyGuideDto {
    const dto = new SkillDifficultyGuideDto();
    dto.skillId = entity.skillId;
    if (entity.context) dto.context = { ...entity.context };
    if (entity.sharedWith) dto.sharedWith = entity.sharedWith;
    dto.examples = entity.examples.map(example => ({ difficulty: example.difficulty, text: { ...example.text } }));
    dto.fallback = entity.fallback === true;
    return dto;
  }
}
