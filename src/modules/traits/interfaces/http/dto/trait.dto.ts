import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../../../shared/interfaces/http/dto/page.dto.js';
import { Trait } from '../../../domain/aggregates/trait.js';
import type { TraitSource } from '../../../domain/value-objects/trait-details.vo.js';
import type { TraitSpecialization } from '../../../domain/value-objects/trait-specialization.vo.js';
import { TraitPrerequisiteDto } from './trait-details.dto.js';

export class TraitDto {
  @ApiProperty({ description: 'Unique identifier for the trait', example: 'ambidextrous' })
  id: string;

  @ApiProperty({ description: 'Version of the stored entity: send it back in a PATCH to detect a concurrent change (409)', example: 3 })
  version: number;

  @ApiProperty({ description: 'Name of the trait', example: 'Ambidextrous' })
  name: string;

  @ApiProperty({ description: 'Category of the trait', example: 'combat' })
  category: string;

  @ApiProperty({ description: 'Indicates if the trait is a talent', example: true })
  isTalent: boolean;

  @ApiProperty({ type: String, description: 'Indicates the specialization of the trait', example: 'combat-skill' })
  specialization: TraitSpecialization | null;

  @ApiProperty({ description: 'Indicates if the trait is tier based', example: false })
  isTierBased: boolean;

  @ApiProperty({ type: Number, description: 'Maximum tier of the trait', example: 5, required: false })
  maxTier: number | undefined;

  @ApiProperty({ description: 'Cost of the trait', example: 7, required: false })
  adquisitionCost: number;

  @ApiProperty({ type: Number, description: 'Cost per tier of the trait', example: 3, required: false })
  tierCost: number | undefined;

  @ApiProperty({ description: 'Description of the trait', required: false, example: 'A trait representing courage and bravery' })
  description?: string;

  @ApiProperty({ type: String, description: 'Training category of the talent (Character Companion)', required: false })
  talentCategory?: string | null;

  @ApiProperty({ type: [TraitPrerequisiteDto], description: 'Prerequisites, one of them per tier', required: false })
  prerequisites?: TraitPrerequisiteDto[];

  @ApiProperty({ type: [String], description: 'Ids of the flaws that may be taken with the talent', required: false })
  possibleFlaws?: string[];

  @ApiProperty({ type: String, description: 'Rulebook of the trait', required: false, example: 'character-companion' })
  source?: TraitSource | null;

  static fromEntity(entity: Trait): TraitDto {
    const dto = new TraitDto();
    dto.id = entity.id;
    dto.version = entity.version;
    dto.name = entity.name;
    dto.category = entity.category;
    dto.isTalent = entity.isTalent;
    dto.specialization = entity.specialization;
    dto.isTierBased = entity.isTierBased;
    dto.maxTier = entity.maxTier;
    dto.adquisitionCost = entity.adquisitionCost;
    dto.tierCost = entity.tierCost;
    dto.description = entity.description;
    dto.talentCategory = entity.talentCategory;
    dto.prerequisites = entity.prerequisites;
    dto.possibleFlaws = entity.possibleFlaws;
    dto.source = entity.source;
    return dto;
  }
}

export class TraitPageDto {
  @ApiProperty({
    type: [TraitDto],
    description: 'Traits',
    isArray: true,
  })
  content: TraitDto[];
  @ApiProperty({
    type: PaginationDto,
    description: 'Pagination information',
  })
  pagination: PaginationDto;
}
