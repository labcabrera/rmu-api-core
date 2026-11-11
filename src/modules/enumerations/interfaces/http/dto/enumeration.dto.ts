import { type AccessLevel } from '../../../../shared/domain/services/entity-access.js';
import { ApiProperty } from '@nestjs/swagger';
import { Enumeration } from '../../../domain/aggregates/enumeration.js';
import { ENUMERATION_CATEGORIES, type EnumerationCategory } from '../../../domain/value-objects/enumeration-category.vo.js';
import type { AccessType } from '../../../../shared/domain/entities/access-type.js';
import { ENTITY_SOURCES, type EntitySource } from '../../../../shared/domain/entities/entity-source.js';
import { PaginationDto } from '../../../../shared/interfaces/http/dto/page.dto.js';

export class EnumerationDto {
  @ApiProperty({ description: 'Unique identifier of the skill', example: 'enumeration-001', required: true })
  id: string;

  @ApiProperty({ description: 'Version of the stored entity: send it back in a PATCH to detect a concurrent change (409)', example: 3 })
  version: number;

  @ApiProperty({ description: 'Normalized key that references store', example: 'black-speech', required: true })
  key: string;

  @ApiProperty({ description: 'Name as the user wrote it', example: 'Black Speech', required: true })
  name: string;

  @ApiProperty({
    description: 'Enumeration category',
    example: 'animal',
    enum: ENUMERATION_CATEGORIES,
    enumName: 'EnumerationCategory',
    required: true,
  })
  category: EnumerationCategory;

  @ApiProperty({ type: String, description: 'Realm id this enumeration belongs to', example: 'realm-123', required: false })
  realmId: string | null;

  @ApiProperty({ type: String, description: 'Description', example: 'A large hoofed mammal', required: false })
  description: string | null;

  @ApiProperty({ type: String, description: 'Image URL', example: 'https://example.com/horse.png', required: false })
  imageUrl: string | null;

  @ApiProperty({ description: 'Owner of the skill', example: 'user123', required: true })
  owner: string;

  @ApiProperty({ type: String, description: 'Access type of the skill', example: 'public', required: true })
  accessType: AccessType;

  @ApiProperty({
    enum: ENTITY_SOURCES,
    description: 'Source: system (rulebook, admin-only changes) or user',
    required: true,
    example: 'user',
  })
  entitySource: EntitySource;

  @ApiProperty({
    enum: ['read', 'write', 'manage'],
    required: false,
    description: 'What the caller can do (spec 069): read, or write (change and delete it); follows the realm when it has one',
    example: 'write',
  })
  access?: AccessLevel;

  static fromEntity(entity: Enumeration, access?: AccessLevel): EnumerationDto {
    const dto = new EnumerationDto();
    if (access) dto.access = access;
    dto.id = entity.id;
    dto.version = entity.version;
    dto.key = entity.key;
    dto.name = entity.name;
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
