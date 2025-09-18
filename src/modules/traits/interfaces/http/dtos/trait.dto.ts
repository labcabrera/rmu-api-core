import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from 'src/modules/core/interfaces/http/dto/page.dto';
import { Trait } from 'src/modules/traits/domain/aggregates/trait';

export class TraitDto {
  @ApiProperty({ description: 'Unique identifier for the trait', example: 'ambidextrous' })
  id: string;

  @ApiProperty({ description: 'Name of the trait', example: 'Ambidextrous' })
  name: string;

  @ApiProperty({ description: 'Description of the realm', required: false, example: 'A fantasy world created by J.R.R. Tolkien' })
  description?: string;

  static fromEntity(entity: Trait): TraitDto {
    const dto = new TraitDto();
    dto.id = entity.id;
    dto.name = entity.name;
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
