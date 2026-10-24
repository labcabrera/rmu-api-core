import { ApiProperty } from '@nestjs/swagger';
import { Race } from '../../../domain/aggregates/race.js';
import { RaceResistancesDto } from './race-resistances.dto.js';
import { RaceStatsDto } from './race-stats.dto.js';
import { SexBasedAttributeDto } from './sex-based-attribute.dto.js';
import { PaginationDto } from '../../../../shared/interfaces/http/dto/page.dto.js';
import { RaceTraitDto } from './race-trait.dto.js';
import type { AccessType } from '../../../../shared/domain/entities/access-type.js';
import { RaceSkillBonusDto } from './race-skill-bonus.dto.js';

export class RaceDto {
  @ApiProperty({ description: 'Unique identifier for the race', example: 'elf' })
  id: string;

  @ApiProperty({ description: 'Version of the stored entity: send it back in a PATCH to detect a concurrent change (409)', example: 3 })
  version: number;

  @ApiProperty({ description: 'Name of the race', example: 'Elf' })
  name: string;

  @ApiProperty({ description: 'Archetype of the race', example: 'wood-elf' })
  archetype: string;

  @ApiProperty({ description: 'Realm identifier', example: 'lotr' })
  realmId: string;

  @ApiProperty({ description: 'Size of the race', example: 'Medium' })
  sizeId: string;

  @ApiProperty({ description: 'Default stat bonus for the race' })
  stats: RaceStatsDto;

  @ApiProperty({ description: 'Resistances of the race' })
  resistances: RaceResistancesDto;

  @ApiProperty({ description: 'Average height of the race by sex' })
  averageHeight: SexBasedAttributeDto;

  @ApiProperty({ description: 'Average weight of the race by sex' })
  averageWeight: SexBasedAttributeDto;

  @ApiProperty({ description: 'Stride bonus for the race' })
  strideBonus: number;

  @ApiProperty({ description: 'Endurance bonus for the race' })
  enduranceBonus: number;

  @ApiProperty({ description: 'Recovery multiplier for the race' })
  recoveryMultiplier: number;

  @ApiProperty({ description: 'Base hits for the race' })
  baseHits: number;

  @ApiProperty({ description: 'Base development points for the race' })
  baseDevPoints: number;

  @ApiProperty({ description: 'Racial armor type', example: 1 })
  baseAt: number;

  @ApiProperty({ description: 'List of racial talents', example: ['Night Vision', 'Keen Senses'] })
  talents: string[];

  @ApiProperty({ description: 'List of race traits', type: [RaceTraitDto] })
  traits: RaceTraitDto[];

  @ApiProperty({ description: 'List of racial skill bonuses', type: [RaceSkillBonusDto] })
  skillBonuses: RaceSkillBonusDto[];

  @ApiProperty({ description: 'Default language identifier', type: String, required: false })
  defaultLanguage: string | null;

  @ApiProperty({ description: 'Description of the race' })
  description: string | null;

  @ApiProperty({ description: 'Image URL of the race', required: false, example: 'https://example.com/images/races/elf.jpg' })
  imageUrl: string | null;

  @ApiProperty({ description: 'Owner identifier', example: 'user123' })
  owner: string;

  @ApiProperty({ type: String, description: 'Access type', required: true })
  accessType: AccessType;

  static fromEntity(entity: Race): RaceDto {
    const dto = new RaceDto();
    dto.id = entity.id;
    dto.version = entity.version;
    dto.name = entity.name;
    dto.archetype = entity.archetype;
    dto.realmId = entity.realmId;
    dto.sizeId = entity.sizeId;
    dto.stats = entity.stats;
    dto.resistances = entity.resistances;
    dto.averageHeight = entity.averageHeight;
    dto.averageWeight = entity.averageWeight;
    dto.strideBonus = entity.strideBonus;
    dto.enduranceBonus = entity.enduranceBonus;
    dto.recoveryMultiplier = entity.recoveryMultiplier;
    dto.baseHits = entity.baseHits;
    dto.baseDevPoints = entity.baseDevPoints;
    dto.baseAt = entity.baseAt;
    dto.defaultLanguage = entity.defaultLanguage;
    dto.talents = entity.talents;
    dto.traits = entity.traits ? entity.traits.map(t => RaceTraitDto.fromEntity(t)) : [];
    dto.skillBonuses = entity.skillBonuses ? entity.skillBonuses.map(b => RaceSkillBonusDto.fromEntity(b)) : [];
    dto.description = entity.description;
    dto.imageUrl = entity.imageUrl;
    dto.owner = entity.owner;
    dto.accessType = entity.accessType;
    return dto;
  }
}

export class RacePageDto {
  @ApiProperty({
    type: [RaceDto],
    description: 'Races',
    isArray: true,
  })
  content: RaceDto[];
  @ApiProperty({
    type: PaginationDto,
    description: 'Pagination information',
  })
  pagination: PaginationDto;
}
