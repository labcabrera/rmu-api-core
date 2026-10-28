import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString, ValidateIf, IsInt, Min } from 'class-validator';
import { UpdateRealmCommand } from '../../../application/cqrs/commands/update-realm.command.js';
import type { MagicPresence } from '../../../domain/value-objects/realm-magic-type.vo.js';
import { ACCESS_TYPES, type AccessType } from '../../../../shared/domain/entities/access-type.js';

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

  @ApiProperty({ description: 'Version the client read (from the GET); a different stored version is a 409', required: false, example: 3 })
  @IsInt()
  @Min(0)
  @IsOptional()
  version?: number;

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
    );
  }
}
