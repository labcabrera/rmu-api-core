import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from 'src/modules/core/interfaces/http/dto/page.dto';

import { Realm } from 'src/modules/realms/domain/aggregates/realm';

export class RealmDto {
  @ApiProperty({ description: 'Unique identifier for the realm', example: 'lotr' })
  id: string;

  @ApiProperty({ description: 'Name of the realm', example: 'Lord of the Rings' })
  name: string;

  @ApiProperty({ description: 'Description of the realm', required: false, example: 'A fantasy world created by J.R.R. Tolkien' })
  description?: string;

  static fromEntity(entity: Realm): RealmDto {
    const dto = new RealmDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.description = entity.description;
    return dto;
  }
}

export class RealmPageDto {
  @ApiProperty({
    type: [RealmDto],
    description: 'Realms',
    isArray: true,
  })
  content: RealmDto[];
  @ApiProperty({
    type: PaginationDto,
    description: 'Pagination information',
  })
  pagination: PaginationDto;
}
