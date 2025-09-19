import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from 'src/modules/core/interfaces/http/dto/page.dto';
import { Language } from 'src/modules/languages/domain/aggregates/language';

export class LanguageDto {
  @ApiProperty({ description: 'Unique identifier for the language', example: 'oestron' })
  id: string;

  @ApiProperty({ description: 'Name of the language', example: 'Oestron' })
  name: string;

  @ApiProperty({ description: 'Description of the language', required: false, example: 'A fictional language created by J.R.R. Tolkien' })
  description?: string;

  static fromEntity(entity: Language): LanguageDto {
    const dto = new LanguageDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.description = entity.description;
    return dto;
  }
}

export class LanguagePageDto {
  @ApiProperty({
    type: [LanguageDto],
    description: 'Languages',
    isArray: true,
  })
  content: LanguageDto[];
  @ApiProperty({
    type: PaginationDto,
    description: 'Pagination information',
  })
  pagination: PaginationDto;
}
