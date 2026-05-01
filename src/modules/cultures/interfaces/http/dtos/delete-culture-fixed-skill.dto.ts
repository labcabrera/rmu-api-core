import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { DeleteCultureFixedSkillRankCommand } from 'src/modules/cultures/application/cqrs/commands/delete-culture-fixed-skill-rank.command';

export class DeleteCultureFixedSkillDto {
  @ApiProperty({ description: 'Skill identifier', required: true, example: 'body-development' })
  @IsString()
  @IsNotEmpty()
  skillId: string;

  @ApiProperty({ description: 'Specialization', required: false, example: 'blade' })
  @IsString()
  @IsOptional()
  specialization: string | null;

  static toCommand(
    cultureId: string,
    dto: DeleteCultureFixedSkillDto,
    userId: string,
    roles: string[],
  ): DeleteCultureFixedSkillRankCommand {
    return new DeleteCultureFixedSkillRankCommand(cultureId, dto.skillId, dto.specialization, userId, roles);
  }
}
