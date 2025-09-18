import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from 'src/modules/core/interfaces/http/dto/page.dto';
import { Trait } from 'src/modules/traits/domain/aggregates/trait';

export class TraitDto {
  @ApiProperty({ description: 'Unique identifier for the trait', example: 'ambidextrous' })
  id: string;

  @ApiProperty({ description: 'Indicates if the trait is a talent', example: true })
  isTalent: boolean;

  @ApiProperty({ description: 'Indicates if the trait requires specialization', example: true })
  requiresSpecialization: boolean;

  @ApiProperty({ description: 'Cost of the trait', example: 7, required: false })
  cost: number | undefined;

  @ApiProperty({ description: 'Description of the trait', required: false, example: 'A trait representing courage and bravery' })
  description?: string;

  static fromEntity(entity: Trait): TraitDto {
    const dto = new TraitDto();
    dto.id = entity.id;
    dto.isTalent = entity.isTalent;
    dto.requiresSpecialization = entity.requiresSpecialization;
    dto.cost = entity.cost;
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
