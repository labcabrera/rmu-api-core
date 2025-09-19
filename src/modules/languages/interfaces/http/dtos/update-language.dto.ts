import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { UpdateLanguageCommand } from 'src/modules/languages/application/cqrs/commands/update-language.command';

export class UpdateLanguageDto {
  @ApiProperty({ description: 'Name of the language', example: 'Oestron' })
  @IsString()
  @IsOptional()
  name: string | undefined;

  @ApiProperty({ description: 'Description of the language', required: false, example: 'A fictional language created by J.R.R. Tolkien' })
  @IsString()
  @IsOptional()
  description: string | undefined;

  static toCommand(id: string, dto: UpdateLanguageDto, userId: string, userRoles: string[]): UpdateLanguageCommand {
    return new UpdateLanguageCommand(id, dto.name, dto.description, userId, userRoles);
  }
}
