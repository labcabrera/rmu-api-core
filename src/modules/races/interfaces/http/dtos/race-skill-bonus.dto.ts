import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { RaceSkillBonus } from 'src/modules/races/domain/value-objects/race-skill-bonus.vo';

export class RaceSkillBonusDto {
  @ApiProperty({ description: 'Skill identifier', required: true, example: 'animal-handling' })
  @IsString()
  skillId: string;

  @ApiProperty({ description: 'Skill specialziation', required: false, example: 'cat' })
  @IsString()
  @IsOptional()
  specialization: string | null;

  @ApiProperty({ description: 'Race bonus', required: true, example: 10 })
  @IsNumber()
  bonus: number;

  static fromEntity(entity: RaceSkillBonus): RaceSkillBonusDto {
    const dto = new RaceSkillBonusDto();
    dto.skillId = entity.skillId;
    dto.specialization = entity.specialization;
    dto.bonus = entity.bonus;
    return dto;
  }
}
