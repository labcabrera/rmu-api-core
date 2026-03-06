import { ApiProperty } from '@nestjs/swagger';
import { Language } from 'src/modules/languages/domain/aggregates/language';
import { PaginationDto } from 'src/modules/shared/interfaces/http/dto/page.dto';
import { NamedEntityDto } from 'src/modules/shared/interfaces/http/dto/named-entity.dto';

export class LanguageDto {
  @ApiProperty({ description: 'Unique identifier for the language', example: 'language-001' })
  id: string;

  @ApiProperty({ description: 'Name of the language', example: 'Quenya' })
  name: string;

  @ApiProperty({ description: 'Realm of the language', type: NamedEntityDto })
  realm: NamedEntityDto;

  @ApiProperty({ description: 'Description of the language', required: false, example: 'A fictional language created by J.R.R. Tolkien' })
  description?: string;

  static fromEntity(entity: Language): LanguageDto {
    const dto = new LanguageDto();
    dto.id = entity.id;
    dto.realm = entity.realm;
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
