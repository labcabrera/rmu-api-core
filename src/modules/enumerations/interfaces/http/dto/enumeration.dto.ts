import { ApiProperty } from '@nestjs/swagger';
import { Enumeration } from 'src/modules/enumerations/domain/aggregates/enumeration';
import type { EnumerationCategory } from 'src/modules/enumerations/domain/value-objects/enumeration-category.vo';
import { PaginationDto } from 'src/modules/shared/interfaces/http/dto/page.dto';

export class EnumerationDto {
  @ApiProperty({ description: 'Unique identifier of the skill', example: 'animal-handling' })
  id: string;

  @ApiProperty({ description: 'Category ID of the skill', example: 'animal' })
  name: string;

  @ApiProperty({ description: 'Category of the skill', example: 'animal' })
  category: EnumerationCategory;

  static fromEntity(entity: Enumeration): EnumerationDto {
    const dto = new EnumerationDto();
    dto.id = entity.id;
    dto.name = entity.name;
    return dto;
  }
}

export class EnumerationPageDto {
  @ApiProperty({
    type: [EnumerationDto],
    description: 'Enumerations',
    isArray: true,
  })
  content: EnumerationDto[];
  @ApiProperty({
    type: PaginationDto,
    description: 'Pagination information',
  })
  pagination: PaginationDto;
}
