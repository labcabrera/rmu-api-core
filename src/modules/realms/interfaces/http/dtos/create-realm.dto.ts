import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { CreateRealmCommand } from 'src/modules/realms/application/cqrs/commands/create-realm.command';

export class CreateRealmDto {
  @ApiProperty({ description: 'Name of the realm', example: 'Lord of the Rings' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Short description of the realm', required: false, example: 'A fantasy world created by J.R.R. Tolkien' })
  @IsString()
  @IsOptional()
  shortDescription: string | undefined;

  @ApiProperty({
    description: 'Description of the realm',
    required: false,
    example: 'A fantasy world created by J.R.R. Tolkien with to much text later',
  })
  @IsString()
  @IsOptional()
  description: string | undefined;

  static toCommand(dto: CreateRealmDto, userId: string, userRoles: string[]) {
    return new CreateRealmCommand(dto.name, dto.shortDescription, dto.description, userId, userRoles);
  }
}
