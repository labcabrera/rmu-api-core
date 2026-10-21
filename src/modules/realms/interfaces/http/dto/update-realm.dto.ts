import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsIn } from 'class-validator';
import { UpdateRealmCommand } from '../../../application/cqrs/commands/update-realm.command.js';
import type { MagicPresence } from '../../../domain/value-objects/realm-magic-type.vo.js';
import type { AccessType } from '../../../../shared/domain/entities/access-type.js';

export class UpdateRealmDto {
  @ApiProperty({ description: 'Name of the realm', example: 'Lord of the Rings' })
  @IsString()
  @IsOptional()
  name: string | undefined;

  @ApiProperty({ type: String, description: 'Magic presence in the realm', example: 'limited', required: false })
  @IsString()
  @IsIn(['unlimited', 'limited', 'none'])
  @IsOptional()
  magicPresence: MagicPresence | undefined;

  @ApiProperty({ description: 'Short description of the realm', required: false, example: 'A fantasy world created by J.R.R. Tolkien' })
  @IsString()
  @IsOptional()
  shortDescription: string | undefined;

  @ApiProperty({
    description: 'Description of the realm',
    required: false,
    example: 'A fantasy world created by J.R.R. Tolkien with too much text later',
  })
  @IsString()
  @IsOptional()
  description: string | undefined;

  @ApiProperty({
    description: 'Image URL of the realm',
    required: false,
    example: 'https://example.com/images/realms/lotr.jpg',
  })
  @IsString()
  @IsOptional()
  imageUrl: string | undefined;

  @ApiProperty({ type: String, description: 'Access type', example: 'public', required: false })
  @IsString()
  @IsOptional()
  accessType: AccessType | undefined;

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
    );
  }
}
