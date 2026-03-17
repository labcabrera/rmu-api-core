import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { CreateEnumerationCommand } from 'src/modules/enumerations/application/cqrs/commands/create-enumeration.command';
import { ENUMERATION_CATEGORIES, type EnumerationCategory } from 'src/modules/enumerations/domain/value-objects/enumeration-category.vo';
import type { AccessType } from 'src/modules/shared/domain/entities/access-type';

export class CreateEnumerationDto {
  @ApiProperty({ description: 'Enumeration name', example: 'horse' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Enumeration category',
    example: 'animal',
    enum: ENUMERATION_CATEGORIES,
    enumName: 'EnumerationCategory',
    required: true,
  })
  @IsIn(ENUMERATION_CATEGORIES)
  @IsNotEmpty()
  category: EnumerationCategory;

  @ApiProperty({ description: 'Access type of the skill', example: 'public' })
  @IsString()
  accessType: AccessType;

  static toCommand(dto: CreateEnumerationDto, userId: string, roles: string[]): CreateEnumerationCommand {
    return new CreateEnumerationCommand(dto.name, dto.category, dto.accessType, userId, roles);
  }
}
