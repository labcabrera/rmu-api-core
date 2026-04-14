import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UpdateCultureCommand } from 'src/modules/cultures/application/cqrs/commands/update-culture.command';
import type { AccessType } from 'src/modules/shared/domain/entities/access-type';
import { CultureSkillRank } from 'src/modules/cultures/domain/value-objects/culture-skill-rank';

export class UpdateCultureDto {
  @ApiProperty({ description: 'Name of the race', example: 'Elf', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Description of the race', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Image URL of the race', required: false, example: 'https://example.com/images/races/elf.jpg' })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ description: 'Access type', required: false, example: 'private' })
  @IsString()
  @IsOptional()
  accessType?: AccessType;

  static toCommand(id: string, dto: UpdateCultureDto, userId: string, roles: string[]): UpdateCultureCommand {
    return new UpdateCultureCommand(id, dto.name, dto.description, dto.imageUrl, dto.accessType, userId, roles);
  }
}
