import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from 'src/modules/shared/interfaces/http/dto/page.dto';
import type { AccessType } from 'src/modules/shared/domain/entities/access-type';
import { Culture } from 'src/modules/cultures/domain/aggregates/culture';

export class CultureDto {
  @ApiProperty({ description: 'Unique identifier for the race', example: 'elf' })
  id: string;

  @ApiProperty({ description: 'Name of the race', example: 'Elf' })
  name: string;

  @ApiProperty({ description: 'Description of the race' })
  description: string | null;

  @ApiProperty({ description: 'Image URL of the race', required: false, example: 'https://example.com/images/races/elf.jpg' })
  imageUrl: string | null;

  @ApiProperty({ description: 'Owner identifier', example: 'user123' })
  owner: string;

  @ApiProperty({ description: 'Access type', required: true })
  accessType: AccessType;

  static fromEntity(entity: Culture): CultureDto {
    const dto = new CultureDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.description = entity.description;
    dto.imageUrl = entity.imageUrl;
    dto.owner = entity.owner;
    dto.accessType = entity.accessType;
    return dto;
  }
}

export class CulturePageDto {
  @ApiProperty({
    type: [CultureDto],
    description: 'Cultures',
    isArray: true,
  })
  content: CultureDto[];
  @ApiProperty({
    type: PaginationDto,
    description: 'Pagination information',
  })
  pagination: PaginationDto;
}
