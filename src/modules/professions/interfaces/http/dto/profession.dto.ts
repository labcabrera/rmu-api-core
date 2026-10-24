import { ApiProperty } from '@nestjs/swagger';
import { Profession } from '../../../domain/aggregates/profession.js';
import { ProfessionSkillCostsDto } from './profession-skill-cost.dto.js';
import { PaginationDto } from '../../../../shared/interfaces/http/dto/page.dto.js';
import type { EntitySource } from '../../../../shared/domain/entities/entity-source.js';
import type { ProfessionArchetype } from '../../../domain/value-objects/profession-archetype.vo.js';
import type { AccessType } from '../../../../shared/domain/entities/access-type.js';

export class ProfessionDto {
  @ApiProperty({ description: 'Profession identifier', example: 'rogue', required: true })
  id: string;

  @ApiProperty({ description: 'Version of the stored entity: send it back in a PATCH to detect a concurrent change (409)', example: 3 })
  version: number;

  @ApiProperty({ type: String, description: 'Archetype for the profession', required: true, example: 'non-spellcaster' })
  archetype: ProfessionArchetype;

  @ApiProperty({ description: 'Available realm types for the profession', required: true, example: ['channeling'] })
  availableRealmTypes: string[];

  @ApiProperty({ description: 'Fixed realm types for the profession', required: true, example: ['channeling'] })
  fixedRealmTypes: string[];

  @ApiProperty({ description: 'Skill costs associated with the profession', required: true })
  skillCosts: ProfessionSkillCostsDto;

  @ApiProperty({ description: 'List of available professional skills', required: true, example: ['riding', 'perception'] })
  professionalSkills: string[];

  @ApiProperty({ type: String, description: 'Entity source of the profession', required: true })
  entitySource: EntitySource;

  @ApiProperty({ description: 'Description of the profession', required: false, example: 'A brave warrior skilled in combat.' })
  description?: string | undefined;

  @ApiProperty({ description: 'Image URL for the profession', required: false, example: 'https://example.com/warrior.png' })
  imageUrl?: string | undefined;

  @ApiProperty({ description: 'Owner of the profession', example: 'user123', required: true })
  owner: string;

  @ApiProperty({ type: String, description: 'Access type', example: 'public', required: true })
  accessType: AccessType;

  static fromEntity(entity: Profession): ProfessionDto {
    return {
      id: entity.id,
      version: entity.version,
      archetype: entity.archetype,
      availableRealmTypes: entity.availableRealmTypes,
      fixedRealmTypes: entity.fixedRealmTypes,
      skillCosts: ProfessionSkillCostsDto.fromEntity(entity.skillCosts),
      professionalSkills: entity.professionalSkills,
      entitySource: entity.entitySource,
      description: entity.description,
      imageUrl: entity.imageUrl,
      owner: entity.owner,
      accessType: entity.accessType,
    };
  }
}

export class ProfessionPageDto {
  @ApiProperty({
    type: [ProfessionDto],
    description: 'Professions',
    isArray: true,
  })
  content: ProfessionDto[];
  @ApiProperty({
    type: PaginationDto,
    description: 'Pagination information',
  })
  pagination: PaginationDto;
}
