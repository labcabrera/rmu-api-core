import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { CreateCultureCommand } from 'src/modules/cultures/application/cqrs/commands/create-culture.command';
import type { AccessType } from 'src/modules/shared/domain/entities/access-type';

export class CreateCultureDto {
  @ApiProperty({ description: 'Name of the race', example: 'Elf' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Description of the race' })
  @IsString()
  @IsOptional()
  description: string | null;

  @ApiProperty({ description: 'Image URL of the race', required: false, example: 'https://example.com/images/races/elf.jpg' })
  @IsString()
  @IsOptional()
  imageUrl: string | null;

  @ApiProperty({ description: 'Access type', required: true, example: 'private' })
  @IsString()
  accessType: AccessType;

  static toCommand(dto: CreateCultureDto, userId: string, roles: string[]): CreateCultureCommand {
    return new CreateCultureCommand(dto.name, dto.description, dto.imageUrl, dto.accessType, userId, roles);
  }
}
