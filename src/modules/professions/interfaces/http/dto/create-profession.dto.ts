import { ApiProperty } from '@nestjs/swagger';
import { ProfessionSkillCostsDto } from './profession-skill-cost.dto.js';
import { CreateProfessionCommand } from '../../../application/cqrs/commands/create-profession.command.js';
import { IsArray, IsObject, IsOptional, IsString } from 'class-validator';
import type { RealmType } from '../../../domain/value-objects/realm-type.vo.js';
import type { ProfessionArchetype } from '../../../domain/value-objects/profession-archetype.vo.js';
import type { AccessType } from '../../../../shared/domain/entities/access-type.js';

export class CreateProfessionDto {
  @ApiProperty({ description: 'Profession ID', example: 'warrior' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'Available realm types for the profession', required: true, example: ['channeling'] })
  @IsArray()
  @IsString({ each: true })
  availableRealmTypes: RealmType[];

  @ApiProperty({ description: 'Fixed realm types for the profession', required: true, example: ['channeling'] })
  @IsArray()
  @IsString({ each: true })
  fixedRealmTypes: RealmType[];

  @ApiProperty({ type: String, description: 'Archetype for the profession', required: true, example: 'non-spellcaster' })
  @IsString()
  archetype: ProfessionArchetype;

  @ApiProperty({ description: 'Skill costs associated with the profession', required: true })
  @IsObject()
  skillCosts: ProfessionSkillCostsDto;

  @ApiProperty({ description: 'List of available professional skills', required: true, example: ['riding', 'perception'] })
  @IsArray()
  @IsString({ each: true })
  professionalSkills: string[];

  @ApiProperty({ type: String, description: 'Description of the profession', example: 'A brave warrior skilled in combat.' })
  @IsString()
  @IsOptional()
  description: string | undefined;

  @ApiProperty({ type: String, description: 'Image URL for the profession', example: 'https://example.com/warrior.png' })
  @IsString()
  @IsOptional()
  imageUrl?: string | undefined;

  @ApiProperty({ type: String, description: 'Access type', required: true, example: 'public' })
  @IsString()
  accessType: AccessType;

  static toCommand(dto: CreateProfessionDto, userId: string, roles: string[]): CreateProfessionCommand {
    return new CreateProfessionCommand(
      dto.id,
      dto.archetype,
      dto.availableRealmTypes,
      dto.fixedRealmTypes,
      dto.skillCosts,
      dto.professionalSkills,
      dto.description,
      dto.imageUrl,
      dto.accessType,
      userId,
      roles,
    );
  }
}
