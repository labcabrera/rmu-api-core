import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UpdateCultureCommand } from 'src/modules/cultures/application/cqrs/commands/update-culture.command';
import type { AccessType } from 'src/modules/shared/domain/entities/access-type';
import { CultureSkillRankDto } from './culture-skill-rank.dto';

export class UpdateCultureDto {
  @ApiProperty({ description: 'Name of the culture', example: 'Nomad', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Description of the culture', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Image URL of the culture', required: false, example: 'images/cultures/nomad.png' })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ description: 'Access type', required: false, example: 'private' })
  @IsString()
  @IsOptional()
  accessType?: AccessType;

  @ApiProperty({
    description: 'Culture ranks entries. When present, replaces the whole list',
    required: false,
    type: [CultureSkillRankDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CultureSkillRankDto)
  @IsOptional()
  skillRanks?: CultureSkillRankDto[];

  @ApiProperty({ description: 'Languages offered by the culture. Empty means all', required: false, type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  languages?: string[];

  @ApiProperty({ description: 'Free text with suggested crafts', required: false })
  @IsString()
  @IsOptional()
  suggestedCrafts?: string;

  @ApiProperty({ description: 'Free text with suggested vocations', required: false })
  @IsString()
  @IsOptional()
  suggestedVocations?: string;

  static toCommand(id: string, dto: UpdateCultureDto, userId: string, roles: string[]): UpdateCultureCommand {
    return new UpdateCultureCommand(
      id,
      dto.name,
      dto.description,
      dto.imageUrl,
      dto.accessType,
      dto.skillRanks?.map(s => CultureSkillRankDto.toProps(s)),
      dto.languages,
      dto.suggestedCrafts,
      dto.suggestedVocations,
      userId,
      roles,
    );
  }
}
