import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { UpdateRealmCommand } from 'src/modules/realms/application/cqrs/commands/update-realm.command';

export class UpdateRealmDto {
  @ApiProperty({ description: 'Name of the realm', example: 'Lord of the Rings' })
  @IsString()
  @IsOptional()
  name: string | undefined;

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
  fieldImageUrl: string | undefined;

  static toCommand(id: string, dto: UpdateRealmDto, userId: string, userRoles: string[]) {
    return new UpdateRealmCommand(id, dto.name, dto.shortDescription, dto.description, dto.fieldImageUrl, userId, userRoles);
  }
}
