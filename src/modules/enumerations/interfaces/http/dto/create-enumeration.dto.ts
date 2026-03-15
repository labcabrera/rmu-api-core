import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateEnumerationCommand } from 'src/modules/enumerations/application/cqrs/commands/create-enumeration.command';
import type { EnumerationCategory } from 'src/modules/enumerations/domain/value-objects/enumeration-category.vo';
import type { AccessType } from 'src/modules/shared/domain/entities/access-type';

export class CreateEnumerationDto {
  @ApiProperty({ description: 'Enumeration name', example: 'animal-handling' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Enumeration category', example: 'animal' })
  @IsString()
  @IsNotEmpty()
  category: EnumerationCategory;

  @ApiProperty({ description: 'Access type of the skill', example: 'public' })
  @IsString()
  accessType: AccessType;

  static toCommand(dto: CreateEnumerationDto, userId: string, roles: string[]): CreateEnumerationCommand {
    return new CreateEnumerationCommand(dto.name, dto.category, dto.accessType, userId, roles);
  }
}
