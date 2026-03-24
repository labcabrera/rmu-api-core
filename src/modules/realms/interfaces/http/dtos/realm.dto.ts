import { ApiProperty } from '@nestjs/swagger';
import { Realm } from 'src/modules/realms/domain/aggregates/realm';
import type { AccessType } from 'src/modules/shared/domain/entities/access-type';
import { PaginationDto } from 'src/modules/shared/interfaces/http/dto/page.dto';

export class RealmDto {
  @ApiProperty({ description: 'Unique identifier for the realm', example: 'lotr' })
  id: string;

  @ApiProperty({ description: 'Name of the realm', example: 'Lord of the Rings' })
  name: string;

  @ApiProperty({ description: 'Magic presence in the realm', example: 'limited' })
  magicPresence: string;

  @ApiProperty({ description: 'Short description of the realm', required: false, example: 'A fantasy world' })
  shortDescription?: string;

  @ApiProperty({ description: 'Description of the realm', required: false, example: 'A fantasy world created by J.R.R. Tolkien' })
  description?: string;

  @ApiProperty({ description: 'Image URL of the realm', required: false, example: 'https://example.com/images/realms/lotr.jpg' })
  imageUrl?: string;

  @ApiProperty({ description: 'Owner of the realm', example: 'user123' })
  owner: string;

  @ApiProperty({ description: 'Access type', example: 'public' })
  accessType: AccessType;

  static fromEntity(entity: Realm): RealmDto {
    const dto = new RealmDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.magicPresence = entity.magicPresence;
    dto.shortDescription = entity.shortDescription;
    dto.description = entity.description;
    dto.imageUrl = entity.imageUrl;
    dto.owner = entity.owner;
    dto.accessType = entity.accessType;
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
