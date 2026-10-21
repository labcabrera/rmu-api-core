import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { CreateEnumerationCommand } from '../../../application/cqrs/commands/create-enumeration.command.js';
import { ENUMERATION_CATEGORIES, type EnumerationCategory } from '../../../domain/value-objects/enumeration-category.vo.js';
import type { AccessType } from '../../../../shared/domain/entities/access-type.js';

export class CreateEnumerationDto {
  @ApiProperty({ description: 'Enumeration key', example: 'horse' })
  @IsString()
  @IsNotEmpty()
  key: string;

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

  @ApiProperty({ description: 'Optional realm id for the enumeration', example: 'realm-123', required: false })
  @IsString()
  @IsOptional()
  realmId?: string | null;

  @ApiProperty({ description: 'Description', example: 'A large hoofed mammal', required: false })
  @IsString()
  @IsOptional()
  description?: string | null;

  @ApiProperty({ description: 'Image URL', example: 'https://example.com/horse.png', required: false })
  @IsString()
  @IsOptional()
  imageUrl?: string | null;

  @ApiProperty({ type: String, description: 'Access type of the skill', example: 'public' })
  @IsString()
  accessType: AccessType;

  static toCommand(dto: CreateEnumerationDto, userId: string, roles: string[]): CreateEnumerationCommand {
    return new CreateEnumerationCommand(
      dto.key,
      dto.category,
      dto.realmId ?? null,
      dto.description ?? null,
      dto.imageUrl ?? null,
      dto.accessType,
      userId,
      roles,
    );
  }
}
