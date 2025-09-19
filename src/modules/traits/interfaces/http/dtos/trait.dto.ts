import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from 'src/modules/core/interfaces/http/dto/page.dto';
import { Trait } from 'src/modules/traits/domain/aggregates/trait';

export class TraitDto {
  @ApiProperty({ description: 'Unique identifier for the trait', example: 'ambidextrous' })
  id: string;

  @ApiProperty({ description: 'Name of the trait', example: 'Ambidextrous' })
  name: string;

  @ApiProperty({ description: 'Category of the trait', example: 'combat' })
  category: string;

  @ApiProperty({ description: 'Indicates if the trait is a talent', example: true })
  isTalent: boolean;

  @ApiProperty({ description: 'Indicates if the trait requires specialization', example: true })
  requiresSpecialization: boolean;

  @ApiProperty({ description: 'Indicates if the trait is tier based', example: false })
  isTierBased: boolean;

  @ApiProperty({ description: 'Maximum tier of the trait', example: 5, required: false })
  maxTier: number | undefined;

  @ApiProperty({ description: 'Cost of the trait', example: 7, required: false })
  adquisitionCost: number;

  @ApiProperty({ description: 'Cost per tier of the trait', example: 3, required: false })
  tierCost: number | undefined;

  @ApiProperty({ description: 'Description of the trait', required: false, example: 'A trait representing courage and bravery' })
  description?: string;

  static fromEntity(entity: Trait): TraitDto {
    const dto = new TraitDto();
    dto.id = entity.id;
    dto.category = entity.category;
    dto.isTalent = entity.isTalent;
    dto.requiresSpecialization = entity.requiresSpecialization;
    dto.isTierBased = entity.isTierBased;
    dto.maxTier = entity.maxTier;
    dto.adquisitionCost = entity.adquisitionCost;
    dto.tierCost = entity.tierCost;
    dto.description = entity.description;
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
