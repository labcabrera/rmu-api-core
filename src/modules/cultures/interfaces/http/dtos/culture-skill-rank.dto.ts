import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import {
  CULTURE_REGIONS,
  CULTURE_SKILL_RANK_TYPES,
  CultureSkillRank,
  CultureSkillRankProps,
} from 'src/modules/cultures/domain/value-objects/culture-skill-rank';
import type { CultureRegion, CultureSkillRankType } from 'src/modules/cultures/domain/value-objects/culture-skill-rank';

/**
 * Culture ranks entry. The fields each type needs are checked by the domain:
 * 'skill' (skillId, optional specialization), 'skill-choice' (skillIds), 'category-pool' (categoryIds),
 * 'languages' (no skill fields) and 'region' (skillId and region).
 */
export class CultureSkillRankDto {
  @ApiProperty({ description: 'Entry type', enum: CULTURE_SKILL_RANK_TYPES, example: 'skill' })
  @IsIn(CULTURE_SKILL_RANK_TYPES)
  type: CultureSkillRankType;

  @ApiProperty({ description: "Skill identifier. Required for 'skill' and 'region'", required: false, example: 'body-development' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  skillId?: string;

  @ApiProperty({
    description: "Skills to choose from. Required for 'skill-choice'; the player picks the specialization",
    required: false,
    type: [String],
    example: ['skill-a', 'skill-b'],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsOptional()
  skillIds?: string[];

  @ApiProperty({ description: "Fixed specialization. Only for 'skill'", required: false, example: 'blade' })
  @IsString()
  @IsOptional()
  specialization?: string;

  @ApiProperty({
    description: "Skill categories the ranks can be spread over. Required for 'category-pool'",
    required: false,
    type: [String],
    example: ['crafting', 'vocation'],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsOptional()
  categoryIds?: string[];

  @ApiProperty({ description: 'Ranks given by the entry (greater than 0)', example: 2 })
  @IsInt()
  @Min(1)
  ranks: number;

  @ApiProperty({ description: 'Maximum ranks per skill when spreading the ranks (greater than 0)', required: false, example: 2 })
  @IsInt()
  @Min(1)
  @IsOptional()
  maxRanksPerSkill?: number;

  @ApiProperty({ description: "Region the specialization refers to. Required for 'region'", required: false, enum: CULTURE_REGIONS })
  @IsIn(CULTURE_REGIONS)
  @IsOptional()
  region?: CultureRegion;

  static fromEntity(entity: CultureSkillRank): CultureSkillRankDto {
    const dto = new CultureSkillRankDto();
    dto.type = entity.type;
    if (entity.skillId !== undefined) dto.skillId = entity.skillId;
    if (entity.skillIds !== undefined) dto.skillIds = entity.skillIds;
    if (entity.specialization !== undefined) dto.specialization = entity.specialization;
    if (entity.categoryIds !== undefined) dto.categoryIds = entity.categoryIds;
    dto.ranks = entity.ranks;
    if (entity.maxRanksPerSkill !== undefined) dto.maxRanksPerSkill = entity.maxRanksPerSkill;
    if (entity.region !== undefined) dto.region = entity.region;
    return dto;
  }

  static toProps(dto: CultureSkillRankDto): CultureSkillRankProps {
    return {
      type: dto.type,
      skillId: dto.skillId,
      skillIds: dto.skillIds,
      specialization: dto.specialization,
      categoryIds: dto.categoryIds,
      ranks: dto.ranks,
      maxRanksPerSkill: dto.maxRanksPerSkill,
      region: dto.region,
    };
  }
}
