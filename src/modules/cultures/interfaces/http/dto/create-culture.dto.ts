import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateCultureCommand } from '../../../application/cqrs/commands/create-culture.command.js';
import type { AccessType } from '../../../../shared/domain/entities/access-type.js';
import { CultureSkillRankDto } from './culture-skill-rank.dto.js';

export class CreateCultureDto {
  @ApiProperty({ description: 'Name of the culture', example: 'Nomad' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: String, description: 'Description of the culture', required: false })
  @IsString()
  @IsOptional()
  description: string | null;

  @ApiProperty({ type: String, description: 'Image URL of the culture', required: false, example: 'images/cultures/nomad.png' })
  @IsString()
  @IsOptional()
  imageUrl: string | null;

  @ApiProperty({ type: String, description: 'Access type', required: true, example: 'private' })
  @IsString()
  accessType: AccessType;

  @ApiProperty({ description: 'Culture ranks entries', required: false, type: [CultureSkillRankDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CultureSkillRankDto)
  @IsOptional()
  skillRanks?: CultureSkillRankDto[];

  @ApiProperty({ description: 'Languages offered by the culture. Empty or missing means all', required: false, type: [String] })
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

  static toCommand(dto: CreateCultureDto, userId: string, roles: string[]): CreateCultureCommand {
    return new CreateCultureCommand(
      dto.name,
      dto.description ?? null,
      dto.imageUrl ?? null,
      dto.accessType,
      dto.skillRanks?.map(s => CultureSkillRankDto.toProps(s)) ?? [],
      dto.languages,
      dto.suggestedCrafts,
      dto.suggestedVocations,
      userId,
      roles,
    );
  }
}
