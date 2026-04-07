import { ApiProperty } from '@nestjs/swagger';
import { Race } from 'src/modules/races/domain/aggregates/race';
import { RaceResistancesDto } from './race-resistances.dto';
import { RaceStatsDto } from './race-stats.dto';
import { SexBasedAttributeDto } from './sex-based-attribute.dto';
import { PaginationDto } from 'src/modules/shared/interfaces/http/dto/page.dto';
import { RaceTraitDto } from './race-trait.dto';
import { NamedEntityDto } from 'src/modules/shared/interfaces/http/dto/named-entity.dto';
import type { AccessType } from 'src/modules/shared/domain/entities/access-type';
import { RaceSkillBonusDto } from './race-skill-bonus.dto';

export class RaceDto {
  @ApiProperty({ description: 'Unique identifier for the race', example: 'elf' })
  id: string;

  @ApiProperty({ description: 'Name of the race', example: 'Elf' })
  name: string;

  @ApiProperty({ description: 'Archetype of the race', example: 'wood-elf' })
  archetype: string;

  @ApiProperty({ description: 'Realm of the race', example: 'lotr' })
  @ApiProperty({ description: 'Realm', type: NamedEntityDto })
  realm: NamedEntityDto;

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

  @ApiProperty({ description: 'Access type', required: true })
  accessType: AccessType;

  static fromEntity(entity: Race): RaceDto {
    const dto = new RaceDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.archetype = entity.archetype;
    dto.realm = NamedEntityDto.fromEntity(entity.realm);
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
    dto.traits = entity.traits ? entity.traits.map((t) => RaceTraitDto.fromEntity(t)) : [];
    dto.skillBonuses = entity.skillBonuses ? entity.skillBonuses.map((b) => RaceSkillBonusDto.fromEntity(b)) : [];
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
