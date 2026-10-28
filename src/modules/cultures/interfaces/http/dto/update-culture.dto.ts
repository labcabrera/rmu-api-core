import { IsArray, IsOptional, IsString, ValidateNested, IsInt, Min, IsIn, IsNotEmpty, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UpdateCultureCommand } from '../../../application/cqrs/commands/update-culture.command.js';
import { ACCESS_TYPES, type AccessType } from '../../../../shared/domain/entities/access-type.js';
import { CultureSkillRankDto } from './culture-skill-rank.dto.js';

export class UpdateCultureDto {
  @ApiProperty({ description: 'Name of the culture', example: 'Nomad', required: false })
  // Absent keeps the name; null or '' is a 400 (a name cannot be cleared).
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiProperty({ description: 'Description of the culture', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Image URL of the culture', required: false, example: 'images/cultures/nomad.png' })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ type: String, description: 'Access type', required: false, example: 'private' })
  @IsIn(ACCESS_TYPES)
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

  @ApiProperty({ description: 'Version the client read (from the GET); a different stored version is a 409', required: false, example: 3 })
  @IsInt()
  @Min(0)
  @IsOptional()
  version?: number;

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
      dto.version,
    );
  }
}
