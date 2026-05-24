import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsOptional } from 'class-validator';
import { UpdateEffectTypeCommand } from 'src/modules/effect-types/application/cqrs/commands/update-effect-type.command';
import {
  EFFECT_PROPERTY_REQUIREMENTS,
  type EffectPropertyRequirement,
} from 'src/modules/effect-types/domain/value-objects/effect-property-requirement.vo';
import type { AccessType } from 'src/modules/shared/domain/entities/access-type';

export class UpdateEffectTypeDto {
  @ApiProperty({ description: 'Indicates if the effect persists over time', example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isPersistent: boolean | undefined;

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

  @ApiProperty({ description: 'Access type of the effect type', example: 'public', required: false })
  @IsIn(['public', 'private'])
  @IsOptional()
  accessType: AccessType | undefined;

  static toCommand(id: string, dto: UpdateEffectTypeDto, userId: string, roles: string[]): UpdateEffectTypeCommand {
    return new UpdateEffectTypeCommand(
      id,
      dto.isPersistent,
      dto.value,
      dto.modifier,
      dto.rounds,
      dto.text,
      dto.location,
      dto.delay,
      dto.accessType,
      userId,
      roles,
    );
  }
}
