import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString, IsOptional, IsInt, IsNotEmpty, Min } from 'class-validator';
import { UpdateEnumerationCommand } from '../../../application/cqrs/commands/update-enumeration.command.js';
import { ENUMERATION_CATEGORIES, type EnumerationCategory } from '../../../domain/value-objects/enumeration-category.vo.js';
import { ACCESS_TYPES, type AccessType } from '../../../../shared/domain/entities/access-type.js';

export class UpdateEnumerationDto {
  @ApiProperty({
    type: String,
    description: 'Key; it cannot change (spec 050), so it is only accepted when it normalizes to the stored one',
    example: 'black-speech',
    required: false,
  })
  @IsString()
  @IsOptional()
  key: string | undefined;

  @ApiProperty({ type: String, description: 'Name as the user writes it', example: 'Black Speech', required: false })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string | undefined;

  @ApiProperty({
    description: 'Enumeration category',
    example: 'animal',
    enum: ENUMERATION_CATEGORIES,
    enumName: 'EnumerationCategory',
    required: true,
  })
  @IsIn(ENUMERATION_CATEGORIES)
  @IsOptional()
  category: EnumerationCategory | undefined;

  @ApiProperty({ type: String, description: 'Optional realm id for the enumeration', example: 'realm-123', required: false })
  @IsString()
  @IsOptional()
  realmId?: string | null | undefined;

  @ApiProperty({ type: String, description: 'Access type of the skill', example: 'public' })
  @IsOptional()
  @IsIn(ACCESS_TYPES)
  accessType: AccessType | undefined;

  @ApiProperty({
    type: String,
    description: 'Description; empty or null clears it',
    example: 'A large hoofed mammal',
    required: false,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  description?: string | null | undefined;

  @ApiProperty({
    type: String,
    description: 'Image URL; empty or null clears it',
    example: 'https://example.com/horse.png',
    required: false,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  imageUrl?: string | null | undefined;

  @ApiProperty({ description: 'Version the client read (from the GET); a different stored version is a 409', required: false, example: 3 })
  @IsInt()
  @Min(0)
  @IsOptional()
  version?: number;

  static toCommand(id: string, dto: UpdateEnumerationDto, userId: string, roles: string[]): UpdateEnumerationCommand {
    return new UpdateEnumerationCommand(
      id,
      dto.key,
      dto.name?.trim(),
      dto.category,
      dto.realmId,
      dto.description,
      dto.imageUrl,
      dto.accessType,
      userId,
      roles,
      dto.version,
    );
  }
}
