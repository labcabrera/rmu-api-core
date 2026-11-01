import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString, ValidateIf, IsInt, Min, IsBoolean } from 'class-validator';
import { UpdateRealmCommand } from '../../../application/cqrs/commands/update-realm.command.js';
import type { MagicPresence } from '../../../domain/value-objects/realm-magic-type.vo.js';
import { ACCESS_TYPES, type AccessType } from '../../../../shared/domain/entities/access-type.js';
import { ENTITY_SOURCES, type EntitySource } from '../../../../shared/domain/entities/entity-source.js';

export class UpdateRealmDto {
  @ApiProperty({ type: String, description: 'Name of the realm', example: 'Lord of the Rings', required: false })
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  name: string | undefined;

  @ApiProperty({ type: String, description: 'Magic presence in the realm', example: 'limited', required: false })
  @IsString()
  @IsIn(['unlimited', 'limited', 'none'])
  @ValidateIf((_, value) => value !== undefined)
  magicPresence: MagicPresence | undefined;

  @ApiProperty({
    type: String,
    description: 'Short description of the realm; empty or null clears it',
    required: false,
    nullable: true,
    example: 'A fantasy world created by J.R.R. Tolkien',
  })
  @IsString()
  @IsOptional()
  shortDescription: string | null | undefined;

  @ApiProperty({
    type: String,
    description: 'Description of the realm; empty or null clears it',
    required: false,
    nullable: true,
    example: 'A fantasy world created by J.R.R. Tolkien with too much text later',
  })
  @IsString()
  @IsOptional()
  description: string | null | undefined;

  @ApiProperty({
    type: String,
    description: 'Image URL of the realm; empty or null clears it',
    required: false,
    nullable: true,
    example: 'https://example.com/images/realms/lotr.jpg',
  })
  @IsString()
  @IsOptional()
  imageUrl: string | null | undefined;

  @ApiProperty({ type: String, description: 'Access type', example: 'public', required: false })
  @IsIn(ACCESS_TYPES)
  @IsOptional()
  accessType: AccessType | undefined;

  @ApiProperty({ type: Boolean, description: 'Generic realm, usable from any campaign (only an admin changes it)', required: false })
  @IsBoolean()
  @IsOptional()
  generic?: boolean;

  @ApiProperty({ description: 'Version the client read (from the GET); a different stored version is a 409', required: false, example: 3 })
  @IsInt()
  @Min(0)
  @IsOptional()
  version?: number;

  @ApiProperty({
    enum: ENTITY_SOURCES,
    description: 'Source: system (rulebook) or user. Only an admin changes it to system; the owner never changes',
    required: false,
    example: 'user',
  })
  @IsOptional()
  @IsIn(ENTITY_SOURCES)
  entitySource?: EntitySource;

  static toCommand(id: string, dto: UpdateRealmDto, userId: string, roles: string[]) {
    return new UpdateRealmCommand(
      id,
      dto.name,
      dto.magicPresence,
      dto.shortDescription,
      dto.description,
      dto.imageUrl,
      dto.accessType,
      userId,
      roles,
      dto.version,
      dto.generic ?? undefined,
      dto.entitySource,
    );
  }
}
