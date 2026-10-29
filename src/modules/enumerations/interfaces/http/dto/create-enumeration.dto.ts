import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString, IsOptional, ValidateIf } from 'class-validator';
import { CreateEnumerationCommand } from '../../../application/cqrs/commands/create-enumeration.command.js';
import { ENUMERATION_CATEGORIES, type EnumerationCategory } from '../../../domain/value-objects/enumeration-category.vo.js';
import { ACCESS_TYPES, type AccessType } from '../../../../shared/domain/entities/access-type.js';

export class CreateEnumerationDto {
  @ApiProperty({ description: 'Name as the user writes it', example: 'Black Speech', required: false })
  @ValidateIf((dto: CreateEnumerationDto) => !dto.key || dto.name !== undefined)
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiProperty({
    description: 'Key; normalized to kebab-case (spec 050). Derived from the name when missing',
    example: 'black-speech',
    required: false,
  })
  @ValidateIf((dto: CreateEnumerationDto) => !dto.name || dto.key !== undefined)
  @IsString()
  @IsNotEmpty()
  key?: string;

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

  @ApiProperty({ type: String, description: 'Optional realm id for the enumeration', example: 'realm-123', required: false })
  @IsString()
  @IsOptional()
  realmId?: string | null;

  @ApiProperty({ type: String, description: 'Description', example: 'A large hoofed mammal', required: false })
  @IsString()
  @IsOptional()
  description?: string | null;

  @ApiProperty({ type: String, description: 'Image URL', example: 'https://example.com/horse.png', required: false })
  @IsString()
  @IsOptional()
  imageUrl?: string | null;

  @ApiProperty({ type: String, description: 'Access type of the skill', example: 'public' })
  @IsIn(ACCESS_TYPES)
  accessType: AccessType;

  static toCommand(dto: CreateEnumerationDto, userId: string, roles: string[]): CreateEnumerationCommand {
    // Older clients only send the key: it is then the name too
    const name = (dto.name ?? dto.key ?? '').trim();
    return new CreateEnumerationCommand(
      dto.key ?? name,
      name,
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
