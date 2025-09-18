import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { CreateRealmCommand } from 'src/modules/realms/application/cqrs/commands/create-realm.command';

export class CreateTraitDto {
  @ApiProperty({ description: 'Name of the trait', example: 'Bravery' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Description of the trait', required: false, example: 'A trait representing courage and bravery' })
  @IsString()
  @IsOptional()
  description: string | undefined;

  static toCommand(dto: CreateTraitDto, userId: string, userRoles: string[]) {
    return new CreateRealmCommand(dto.name, dto.description, userId, userRoles);
  }
}
