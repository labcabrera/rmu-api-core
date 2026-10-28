import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';
import { CreateRealmCommand } from '../../../application/cqrs/commands/create-realm.command.js';
import type { MagicPresence } from '../../../domain/value-objects/realm-magic-type.vo.js';
import { ACCESS_TYPES, type AccessType } from '../../../../shared/domain/entities/access-type.js';

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
    );
  }
}
