import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import type { AccessType } from 'src/modules/shared/domain/entities/access-type';
import { PaginationDto } from 'src/modules/shared/interfaces/http/dto/page.dto';
import { ManeuverModifier } from 'src/modules/maneuver-modifiers/domain/aggregates/maneuver-modifier';
import { MANEUVER_MODIFIER_TYPES } from 'src/modules/maneuver-modifiers/domain/value-objects/maneuver-modifier-type.vo';
import type { ManeuverModifierType } from 'src/modules/maneuver-modifiers/domain/value-objects/maneuver-modifier-type.vo';

export class ManeuverModifierOptionDto {
  @ApiProperty({ description: 'Option key', example: 'option-a' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ description: 'Value added when the option is selected', example: 10 })
  @IsNumber()
  value: number;
}

export class ManeuverModifierScopeDto {
  @ApiProperty({ description: 'Skills the modifier applies to', example: ['some-skill'], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  skillIds?: string[];

  @ApiProperty({ description: 'Skill categories the modifier applies to', example: ['some-category'], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  categoryIds?: string[];
}

export class ManeuverModifierDto {
  @ApiProperty({ description: 'Identifier', example: '0f0e3c1a-2b7c-4c1e-9f62-3f1d2c3b4a5d' })
  id: string;

  @ApiProperty({ description: 'Unique key, also used as translation key', example: 'some-modifier' })
  key: string;

  @ApiProperty({ type: ManeuverModifierScopeDto })
  scope: ManeuverModifierScopeDto;

  @ApiProperty({ enum: MANEUVER_MODIFIER_TYPES, example: 'choice' })
  type: ManeuverModifierType;

  @ApiProperty({ description: 'flag: value added when selected', required: false })
  value?: number;

  @ApiProperty({ description: 'choice: options', type: [ManeuverModifierOptionDto], required: false })
  options?: ManeuverModifierOptionDto[];

  @ApiProperty({ description: 'number: value added per unit', required: false })
  perUnit?: number;

  @ApiProperty({ description: 'number: minimum units', required: false })
  min?: number;

  @ApiProperty({ description: 'number: maximum units', required: false })
  max?: number;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ example: 'public' })
  accessType: AccessType;

  @ApiProperty()
  owner: string;

  static fromEntity(entity: ManeuverModifier): ManeuverModifierDto {
    const dto = new ManeuverModifierDto();
    dto.id = entity.id;
    dto.key = entity.key;
    dto.scope = { ...entity.scope };
    dto.type = entity.type;
    dto.value = entity.value;
    dto.options = entity.options?.map(option => ({ key: option.key, value: option.value }));
    dto.perUnit = entity.perUnit;
    dto.min = entity.min;
    dto.max = entity.max;
    dto.description = entity.description;
    dto.accessType = entity.accessType;
    dto.owner = entity.owner;
    return dto;
  }
}

export class ManeuverModifierPageDto {
  @ApiProperty({ type: [ManeuverModifierDto] })
  content: ManeuverModifierDto[];

  @ApiProperty({ type: PaginationDto })
  pagination: PaginationDto;
}

export class ManeuverModifierDefinitionFields {
  @ApiProperty({ type: ManeuverModifierScopeDto })
  @ValidateNested()
  @Type(() => ManeuverModifierScopeDto)
  scope: ManeuverModifierScopeDto;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  value?: number;

  @ApiProperty({ type: [ManeuverModifierOptionDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ManeuverModifierOptionDto)
  @IsOptional()
  options?: ManeuverModifierOptionDto[];

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  perUnit?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  min?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  max?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
