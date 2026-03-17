import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString, IsOptional } from 'class-validator';
import { UpdateEnumerationCommand } from 'src/modules/enumerations/application/cqrs/commands/update-enumeration.command';
import { ENUMERATION_CATEGORIES, type EnumerationCategory } from 'src/modules/enumerations/domain/value-objects/enumeration-category.vo';
import type { AccessType } from 'src/modules/shared/domain/entities/access-type';

export class UpdateEnumerationDto {
  @ApiProperty({ description: 'Enumeration key', example: 'horse' })
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

  @ApiProperty({ description: 'Optional realm id for the enumeration', example: 'realm-123', required: false })
  @IsString()
  @IsOptional()
  realmId?: string | null | undefined;

  @ApiProperty({ description: 'Access type of the skill', example: 'public' })
  @IsOptional()
  accessType: AccessType | undefined;

  static toCommand(id: string, dto: UpdateEnumerationDto, userId: string, roles: string[]): UpdateEnumerationCommand {
    return new UpdateEnumerationCommand(id, dto.key, dto.category, dto.realmId, dto.accessType, userId, roles);
  }
}
