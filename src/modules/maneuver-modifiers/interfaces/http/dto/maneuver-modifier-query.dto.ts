import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PagedQueryDto } from 'src/modules/shared/interfaces/http/dto/paged-rsql-query';

export class ManeuverModifierQueryDto extends PagedQueryDto {
  @ApiPropertyOptional({ description: 'Skill id: returns the modifiers of the skill and of its category (plain array)' })
  @IsString()
  @IsOptional()
  skillId?: string;

  @ApiPropertyOptional({ description: 'Skill category id: returns the modifiers of the category (plain array)' })
  @IsString()
  @IsOptional()
  categoryId?: string;
}
