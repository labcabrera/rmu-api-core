import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsIn } from 'class-validator';
import { UpdateRealmCommand } from 'src/modules/realms/application/cqrs/commands/update-realm.command';
import { MagicPresence } from 'src/modules/realms/domain/value-objects/realm-magic-type.vo';
import { AccessType } from 'src/modules/shared/domain/entities/access-type';

export class UpdateRealmDto {
  @ApiProperty({ description: 'Name of the realm', example: 'Lord of the Rings' })
  @IsString()
  @IsOptional()
  name: string | undefined;

  @ApiProperty({ description: 'Magic presence in the realm', example: 'limited', required: false })
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

  @ApiProperty({ description: 'Is the realm public', example: true, required: false })
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
