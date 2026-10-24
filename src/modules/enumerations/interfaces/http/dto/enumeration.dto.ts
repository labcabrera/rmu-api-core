import { ApiProperty } from '@nestjs/swagger';
import { Enumeration } from '../../../domain/aggregates/enumeration.js';
import { ENUMERATION_CATEGORIES, type EnumerationCategory } from '../../../domain/value-objects/enumeration-category.vo.js';
import type { AccessType } from '../../../../shared/domain/entities/access-type.js';
import type { EntitySource } from '../../../../shared/domain/entities/entity-source.js';
import { PaginationDto } from '../../../../shared/interfaces/http/dto/page.dto.js';

export class EnumerationDto {
  @ApiProperty({ description: 'Unique identifier of the skill', example: 'enumeration-001', required: true })
  id: string;

  @ApiProperty({ description: 'Version of the stored entity: send it back in a PATCH to detect a concurrent change (409)', example: 3 })
  version: number;

  @ApiProperty({ description: 'Category ID of the skill', example: 'animal', required: true })
  key: string;

  @ApiProperty({ description: 'Human readable name', example: 'Horse', required: true })
  name: string;

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

  @ApiProperty({ description: 'Description', example: 'A large hoofed mammal', required: false })
  description: string | null;

  @ApiProperty({ description: 'Image URL', example: 'https://example.com/horse.png', required: false })
  imageUrl: string | null;

  @ApiProperty({ description: 'Owner of the skill', example: 'user123', required: true })
  owner: string;

  @ApiProperty({ type: String, description: 'Access type of the skill', example: 'public', required: true })
  accessType: AccessType;

  @ApiProperty({ type: String, description: 'Entity source', example: 'user', required: true })
  entitySource: EntitySource;

  static fromEntity(entity: Enumeration): EnumerationDto {
    const dto = new EnumerationDto();
    dto.id = entity.id;
    dto.version = entity.version;
    dto.key = entity.key;
    dto.category = entity.category;
    dto.realmId = entity.realmId;
    dto.description = entity.description;
    dto.imageUrl = entity.imageUrl;
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
