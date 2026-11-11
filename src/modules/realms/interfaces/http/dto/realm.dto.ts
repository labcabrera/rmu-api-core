import { ApiProperty } from '@nestjs/swagger';
import { Realm } from '../../../domain/aggregates/realm.js';
import type { AccessType } from '../../../../shared/domain/entities/access-type.js';
import { PaginationDto } from '../../../../shared/interfaces/http/dto/page.dto.js';
import { ENTITY_SOURCES, type EntitySource } from '../../../../shared/domain/entities/entity-source.js';
import { type AccessLevel, resolveAccess } from '../../../../shared/domain/services/entity-access.js';
import { EntityShareDto } from '../../../../shared/interfaces/http/dto/entity-share.dto.js';

/** What the caller can do with the entity (spec 069). A response never carries 'none'. */
export const RESPONSE_ACCESS_LEVELS = ['read', 'write', 'manage'] as const;

export class RealmDto {
  @ApiProperty({ description: 'Unique identifier for the realm', example: 'lotr' })
  id: string;

  @ApiProperty({ description: 'Version of the stored entity: send it back in a PATCH to detect a concurrent change (409)', example: 3 })
  version: number;

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

  @ApiProperty({ type: String, description: 'Access type', example: 'public' })
  accessType: AccessType;

  @ApiProperty({
    enum: ENTITY_SOURCES,
    description: 'Source: system (rulebook, admin-only changes) or user',
    required: true,
    example: 'user',
  })
  entitySource: EntitySource;

  @ApiProperty({ description: 'Generic realm (RMU Core), usable from any campaign', example: false })
  generic: boolean;

  @ApiProperty({
    enum: RESPONSE_ACCESS_LEVELS,
    description: 'What the caller can do: read; write (edit it and its races and enumerations); manage (also delete, visibility, shares)',
    example: 'manage',
  })
  access: AccessLevel;

  @ApiProperty({ type: [EntityShareDto], required: false, description: 'Who else reads or writes it: only for whoever manages it' })
  shares?: EntityShareDto[];

  /** `user` is the caller: it gives `access`, and `shares` only to who manages the realm. */
  static fromEntity(entity: Realm, user: { id: string; roles: string[] }): RealmDto {
    const dto = new RealmDto();
    dto.id = entity.id;
    dto.version = entity.version;
    dto.name = entity.name;
    dto.magicPresence = entity.magicPresence;
    dto.shortDescription = entity.shortDescription;
    dto.description = entity.description;
    dto.imageUrl = entity.imageUrl;
    dto.owner = entity.owner;
    dto.accessType = entity.accessType;
    dto.entitySource = entity.entitySource;
    dto.generic = entity.generic;
    dto.access = resolveAccess(entity, user.id, user.roles);
    if (dto.access === 'manage') dto.shares = entity.shares.map(share => EntityShareDto.fromShare(share));
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
