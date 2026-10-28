import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString, IsOptional, IsInt, Min } from 'class-validator';
import { UpdateEnumerationCommand } from '../../../application/cqrs/commands/update-enumeration.command.js';
import { ENUMERATION_CATEGORIES, type EnumerationCategory } from '../../../domain/value-objects/enumeration-category.vo.js';
import { ACCESS_TYPES, type AccessType } from '../../../../shared/domain/entities/access-type.js';

export class UpdateEnumerationDto {
  @ApiProperty({ type: String, description: 'Enumeration key', example: 'horse' })
  @IsString()
  @IsOptional()
  key: string | undefined;

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

  @ApiProperty({ type: String, description: 'Description', example: 'A large hoofed mammal', required: false })
  @IsString()
  @IsOptional()
  description?: string | null | undefined;

  @ApiProperty({ type: String, description: 'Image URL', example: 'https://example.com/horse.png', required: false })
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
      dto.category,
      dto.realmId,
      dto.description ?? null,
      dto.imageUrl ?? null,
      dto.accessType,
      userId,
      roles,
      dto.version,
    );
  }
}
