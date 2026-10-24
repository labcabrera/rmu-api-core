import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsOptional, IsInt, Min } from 'class-validator';
import { UpdateEffectTypeCommand } from '../../../application/cqrs/commands/update-effect-type.command.js';
import {
  EFFECT_PROPERTY_REQUIREMENTS,
  type EffectPropertyRequirement,
} from '../../../domain/value-objects/effect-property-requirement.vo.js';
import type { AccessType } from '../../../../shared/domain/entities/access-type.js';

export class UpdateEffectTypeDto {
  @ApiProperty({ type: Boolean, description: 'Indicates if the effect persists over time', example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isPersistent: boolean | undefined;

  @ApiProperty({ type: Boolean, description: 'Indicates if the effect can be stacked', example: false, required: false })
  @IsBoolean()
  @IsOptional()
  isStackable: boolean | undefined;

  @ApiProperty({ enum: EFFECT_PROPERTY_REQUIREMENTS, enumName: 'EffectPropertyRequirement', example: 'required', required: false })
  @IsIn(EFFECT_PROPERTY_REQUIREMENTS)
  @IsOptional()
  value: EffectPropertyRequirement | undefined;

  @ApiProperty({ enum: EFFECT_PROPERTY_REQUIREMENTS, enumName: 'EffectPropertyRequirement', example: 'optional', required: false })
  @IsIn(EFFECT_PROPERTY_REQUIREMENTS)
  @IsOptional()
  modifier: EffectPropertyRequirement | undefined;

  @ApiProperty({ enum: EFFECT_PROPERTY_REQUIREMENTS, enumName: 'EffectPropertyRequirement', example: 'forbidden', required: false })
  @IsIn(EFFECT_PROPERTY_REQUIREMENTS)
  @IsOptional()
  rounds: EffectPropertyRequirement | undefined;

  @ApiProperty({ enum: EFFECT_PROPERTY_REQUIREMENTS, enumName: 'EffectPropertyRequirement', example: 'optional', required: false })
  @IsIn(EFFECT_PROPERTY_REQUIREMENTS)
  @IsOptional()
  text: EffectPropertyRequirement | undefined;

  @ApiProperty({ enum: EFFECT_PROPERTY_REQUIREMENTS, enumName: 'EffectPropertyRequirement', example: 'forbidden', required: false })
  @IsIn(EFFECT_PROPERTY_REQUIREMENTS)
  @IsOptional()
  location: EffectPropertyRequirement | undefined;

  @ApiProperty({ enum: EFFECT_PROPERTY_REQUIREMENTS, enumName: 'EffectPropertyRequirement', example: 'forbidden', required: false })
  @IsIn(EFFECT_PROPERTY_REQUIREMENTS)
  @IsOptional()
  delay: EffectPropertyRequirement | undefined;

  @ApiProperty({ type: String, description: 'Access type of the effect type', example: 'public', required: false })
  @IsIn(['public', 'private'])
  @IsOptional()
  accessType: AccessType | undefined;

  @ApiProperty({ description: 'Version the client read (from the GET); a different stored version is a 409', required: false, example: 3 })
  @IsInt()
  @Min(0)
  @IsOptional()
  version?: number;

  static toCommand(id: string, dto: UpdateEffectTypeDto, userId: string, roles: string[]): UpdateEffectTypeCommand {
    return new UpdateEffectTypeCommand(
      id,
      dto.isPersistent,
      dto.isStackable,
      dto.value,
      dto.modifier,
      dto.rounds,
      dto.text,
      dto.location,
      dto.delay,
      dto.accessType,
      userId,
      roles,
      dto.version,
    );
  }
}
