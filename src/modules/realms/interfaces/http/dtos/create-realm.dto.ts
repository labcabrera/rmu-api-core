import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';
import { CreateRealmCommand } from 'src/modules/realms/application/cqrs/commands/create-realm.command';
import type { MagicPresence } from 'src/modules/realms/domain/value-objects/realm-magic-type.vo';
import type { AccessType } from 'src/modules/shared/domain/entities/access-type';

export class CreateRealmDto {
  @ApiProperty({ description: 'Name of the realm', example: 'Lord of the Rings' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Short description of the realm', required: false, example: 'A fantasy world created by J.R.R. Tolkien' })
  @IsString()
  @IsOptional()
  shortDescription: string | undefined;

  @ApiProperty({ description: 'Magic presence in the realm', example: 'limited' })
  @IsString()
  @IsIn(['unlimited', 'limited', 'none'])
  magicPresence: MagicPresence;

  @ApiProperty({
    description: 'Description of the realm',
    required: false,
    example: 'A fantasy world created by J.R.R. Tolkien with to much text later',
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

  @ApiProperty({ description: 'Access type', example: 'public' })
  @IsString()
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
