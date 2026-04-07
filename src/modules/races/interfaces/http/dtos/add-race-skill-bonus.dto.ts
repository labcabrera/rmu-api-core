import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { AddRaceSkillBonusCommand } from 'src/modules/races/application/cqrs/commands/add-race-skill-bonus.command';

export class AddRaceSkillBonusDto {
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

  static toCommand(raceId: string, dto: AddRaceSkillBonusDto, userId: string, userRoles: string[]) {
    return new AddRaceSkillBonusCommand(raceId, dto.skillId, dto.specialization, dto.bonus, userId, userRoles);
  }
}
