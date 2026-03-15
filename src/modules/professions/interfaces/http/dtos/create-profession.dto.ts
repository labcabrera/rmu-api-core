import { ApiProperty } from '@nestjs/swagger';
import { ProfessionSkillCostsDto } from './profession-skill-cost.dto';
import { CreateProfessionCommand } from 'src/modules/professions/application/cqrs/commands/create-profession.command';
import { IsArray, IsObject, IsOptional, IsString } from 'class-validator';
import { RealmType } from 'src/modules/professions/domain/value-objects/realm-type.vo';
import type { ProfessionArchetype } from 'src/modules/professions/domain/value-objects/profession-archetype.vo';
import type { AccessType } from 'src/modules/shared/domain/entities/access-type';

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

  @ApiProperty({ description: 'Archetype for the profession', required: true, example: 'non-spellcaster' })
  @IsString()
  archetype: ProfessionArchetype;

  @ApiProperty({ description: 'Skill costs associated with the profession', required: true })
  @IsObject()
  skillCosts: ProfessionSkillCostsDto;

  @ApiProperty({ description: 'List of available professional skills', required: true, example: ['riding', 'perception'] })
  @IsArray()
  @IsString({ each: true })
  professionalSkills: string[];

  @ApiProperty({ description: 'Description of the profession', example: 'A brave warrior skilled in combat.' })
  @IsString()
  @IsOptional()
  description: string | undefined;

  @ApiProperty({ description: 'Image URL for the profession', example: 'https://example.com/warrior.png' })
  @IsString()
  @IsOptional()
  imageUrl?: string | undefined;

  @ApiProperty({ description: 'Access type', required: true, example: 'public' })
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
