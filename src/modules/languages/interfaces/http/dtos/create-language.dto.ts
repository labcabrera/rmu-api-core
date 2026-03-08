import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { CreateLanguageCommand } from 'src/modules/languages/application/cqrs/commands/create-language.command';

export class CreateLanguageDto {
  @ApiProperty({ description: 'Name of the language', example: 'Sindar' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Realm identifier', example: 'realm-123' })
  @IsString()
  @IsNotEmpty()
  realmId: string;

  @ApiProperty({ description: 'Description of the language', required: false, example: 'A fictional language created by J.R.R. Tolkien' })
  @IsString()
  @IsOptional()
  description: string | undefined;

  static toCommand(dto: CreateLanguageDto, userId: string, userRoles: string[]): CreateLanguageCommand {
    return new CreateLanguageCommand(dto.name, dto.realmId, dto.description, userId, userRoles);
  }
}
