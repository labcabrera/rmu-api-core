import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsIn, IsBoolean } from 'class-validator';
import { CreateRealmCommand } from '../../../application/cqrs/commands/create-realm.command.js';
import type { MagicPresence } from '../../../domain/value-objects/realm-magic-type.vo.js';
import { ACCESS_TYPES, type AccessType } from '../../../../shared/domain/entities/access-type.js';
import { ENTITY_SOURCES, type EntitySource } from '../../../../shared/domain/entities/entity-source.js';

export class CreateRealmDto {
  @ApiProperty({ description: 'Name of the realm', example: 'Lord of the Rings' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: String,
    description: 'Short description of the realm',
    required: false,
    example: 'A fantasy world created by J.R.R. Tolkien',
  })
  @IsString()
  @IsOptional()
  shortDescription: string | undefined;

  @ApiProperty({ type: String, description: 'Magic presence in the realm', example: 'limited' })
  @IsString()
  @IsIn(['unlimited', 'limited', 'none'])
  magicPresence: MagicPresence;

  @ApiProperty({
    type: String,
    description: 'Description of the realm',
    required: false,
    example: 'A fantasy world created by J.R.R. Tolkien with to much text later',
  })
  @IsString()
  @IsOptional()
  description: string | undefined;

  @ApiProperty({
    type: String,
    description: 'Image URL of the realm',
    required: false,
    example: 'https://example.com/images/realms/lotr.jpg',
  })
  @IsString()
  @IsOptional()
  imageUrl: string | undefined;

  @ApiProperty({ type: String, description: 'Access type', example: 'public' })
  @IsIn(ACCESS_TYPES)
  accessType: AccessType;

  @ApiProperty({
    type: Boolean,
    description: 'Generic realm, usable from any campaign (only an admin sets it)',
    required: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  generic?: boolean;

  @ApiProperty({
    enum: ENTITY_SOURCES,
    description: 'Source: system (rulebook, only an admin sets it) or user. Missing on create means user',
    required: false,
    example: 'user',
  })
  @IsOptional()
  @IsIn(ENTITY_SOURCES)
  entitySource?: EntitySource;

  static toCommand(dto: CreateRealmDto, userId: string, userRoles: string[]) {
    return new CreateRealmCommand(
      dto.name,
      dto.shortDescription,
      dto.description,
      dto.imageUrl,
      dto.magicPresence,
      dto.accessType,
      userId,
      userRoles,
      dto.generic ?? false,
      dto.entitySource,
    );
  }
}
