import { ApiProperty } from '@nestjs/swagger';
import { Enumeration } from 'src/modules/enumerations/domain/aggregates/enumeration';
import type { EnumerationCategory } from 'src/modules/enumerations/domain/value-objects/enumeration-category.vo';
import type { AccessType } from 'src/modules/shared/domain/entities/access-type';
import { PaginationDto } from 'src/modules/shared/interfaces/http/dto/page.dto';

export class EnumerationDto {
  @ApiProperty({ description: 'Unique identifier of the skill', example: 'enumeration-001', required: true })
  id: string;

  @ApiProperty({ description: 'Category ID of the skill', example: 'animal', required: true })
  name: string;

  @ApiProperty({ description: 'Category of the skill', example: 'animal', required: true })
  category: EnumerationCategory;

  @ApiProperty({ description: 'Owner of the skill', example: 'user123', required: true })
  owner: string;

  @ApiProperty({ description: 'Access type of the skill', example: 'public', required: true })
  accessType: AccessType;

  static fromEntity(entity: Enumeration): EnumerationDto {
    const dto = new EnumerationDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.category = entity.category;
    dto.owner = entity.owner;
    dto.accessType = entity.accessType;
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
