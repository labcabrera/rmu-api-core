import { ApiProperty } from '@nestjs/swagger';
import { ProfessionSkillCostsDto } from './profession-skill-cost.dto.js';
import { IsArray, IsObject, IsOptional, IsString, IsInt, Min } from 'class-validator';
import { UpdateProfessionCommand } from '../../../application/cqrs/commands/update-profession.command.js';
import type { RealmType } from '../../../domain/value-objects/realm-type.vo.js';
import type { ProfessionArchetype } from '../../../domain/value-objects/profession-archetype.vo.js';
import type { AccessType } from '../../../../shared/domain/entities/access-type.js';

export class UpdateProfessionDto {
  @ApiProperty({ description: 'Available realm types for the profession', required: false, example: ['channeling'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  availableRealmTypes: RealmType[] | undefined;

  @ApiProperty({ description: 'Fixed realm types for the profession', required: false, example: ['channeling'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  fixedRealmTypes: RealmType[] | undefined;

  @ApiProperty({ type: String, description: 'Archetype for the profession', required: false, example: 'non-spellcaster' })
  @IsString()
  @IsOptional()
  archetype: ProfessionArchetype | undefined;

  @ApiProperty({ description: 'Skill costs associated with the profession', required: false })
  @IsObject()
  @IsOptional()
  skillCosts: ProfessionSkillCostsDto | undefined;

  @ApiProperty({ description: 'List of available professional skills', required: false, example: ['riding', 'perception'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  professionalSkills: string[] | undefined;

  @ApiProperty({
    type: String,
    description: 'Description of the profession',
    example: 'A brave warrior skilled in combat.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description: string | undefined;

  @ApiProperty({ type: String, description: 'Image URL for the profession', example: 'https://example.com/warrior.png', required: false })
  @IsString()
  @IsOptional()
  imageUrl: string | undefined;

  @ApiProperty({ type: String, description: 'Access type for the profession', example: 'public', required: false })
  @IsString()
  @IsOptional()
  accessType: AccessType | undefined;

  @ApiProperty({ description: 'Version the client read (from the GET); a different stored version is a 409', required: false, example: 3 })
  @IsInt()
  @Min(0)
  @IsOptional()
  version?: number;

  static toCommand(professionId: string, dto: UpdateProfessionDto, userId: string, roles: string[]): UpdateProfessionCommand {
    return new UpdateProfessionCommand(
      professionId,
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
      dto.version,
    );
  }
}
