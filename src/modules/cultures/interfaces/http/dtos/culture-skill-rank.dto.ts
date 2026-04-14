import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { CultureSkillRank } from 'src/modules/cultures/domain/value-objects/culture-skill-rank';

export class CultureSkillRankDto {
  @ApiProperty({ description: 'Skill identifier', required: true, example: 'body-development' })
  @IsString()
  @IsNotEmpty()
  skillId: string;

  @ApiProperty({ description: 'Specialization', required: false, example: 'blade' })
  @IsString()
  @IsOptional()
  specialization: string | null;

  @ApiProperty({ description: 'Ranks', required: true, example: 2 })
  @IsNumber()
  ranks: number;

  static fromEntity(entity: CultureSkillRank): CultureSkillRankDto {
    const dto = new CultureSkillRankDto();
    dto.skillId = entity.skillId;
    dto.specialization = entity.specialization;
    dto.ranks = entity.ranks;
    return dto;
  }

  static toEntity(dto: CultureSkillRankDto): CultureSkillRank {
    return new CultureSkillRank(dto.skillId, dto.specialization ?? null, dto.ranks);
  }
}
