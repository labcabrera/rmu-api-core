import { ApiProperty } from '@nestjs/swagger';
import { Enumeration } from 'src/modules/enumerations/domain/aggregates/enumeration';
import { ENUMERATION_CATEGORIES, type EnumerationCategory } from 'src/modules/enumerations/domain/value-objects/enumeration-category.vo';
import type { AccessType } from 'src/modules/shared/domain/entities/access-type';
import type { EntitySource } from 'src/modules/shared/domain/entities/entity-source';
import { PaginationDto } from 'src/modules/shared/interfaces/http/dto/page.dto';

export class EnumerationDto {
  @ApiProperty({ description: 'Unique identifier of the skill', example: 'enumeration-001', required: true })
  id: string;

  @ApiProperty({ description: 'Category ID of the skill', example: 'animal', required: true })
  key: string;

  @ApiProperty({
    description: 'Enumeration category',
    example: 'animal',
    enum: ENUMERATION_CATEGORIES,
    enumName: 'EnumerationCategory',
    required: true,
  })
  category: EnumerationCategory;

  @ApiProperty({ description: 'Realm id this enumeration belongs to', example: 'realm-123', required: false })
  realmId: string | null;

  @ApiProperty({ description: 'Owner of the skill', example: 'user123', required: true })
  owner: string;

  @ApiProperty({ description: 'Access type of the skill', example: 'public', required: true })
  accessType: AccessType;

  @ApiProperty({ description: 'Entity source', example: 'user', required: true })
  entitySource: EntitySource;

  static fromEntity(entity: Enumeration): EnumerationDto {
    const dto = new EnumerationDto();
    dto.id = entity.id;
    dto.key = entity.key;
    dto.category = entity.category;
    dto.realmId = entity.realmId;
    dto.owner = entity.owner;
    dto.accessType = entity.accessType;
    dto.entitySource = entity.entitySource;
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
