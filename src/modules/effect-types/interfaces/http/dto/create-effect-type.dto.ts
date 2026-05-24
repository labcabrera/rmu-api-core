import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsNotEmpty, IsString } from 'class-validator';
import { CreateEffectTypeCommand } from 'src/modules/effect-types/application/cqrs/commands/create-effect-type.command';
import {
  EFFECT_PROPERTY_REQUIREMENTS,
  type EffectPropertyRequirement,
} from 'src/modules/effect-types/domain/value-objects/effect-property-requirement.vo';
import type { AccessType } from 'src/modules/shared/domain/entities/access-type';

export class CreateEffectTypeDto {
  @ApiProperty({ description: 'Effect type identifier', example: 'bleeding' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'Indicates if the effect persists over time', example: true })
  @IsBoolean()
  isPersistent: boolean;

  @ApiProperty({ enum: EFFECT_PROPERTY_REQUIREMENTS, enumName: 'EffectPropertyRequirement', example: 'required' })
  @IsIn(EFFECT_PROPERTY_REQUIREMENTS)
  value: EffectPropertyRequirement;

  @ApiProperty({ enum: EFFECT_PROPERTY_REQUIREMENTS, enumName: 'EffectPropertyRequirement', example: 'optional' })
  @IsIn(EFFECT_PROPERTY_REQUIREMENTS)
  modifier: EffectPropertyRequirement;

  @ApiProperty({ enum: EFFECT_PROPERTY_REQUIREMENTS, enumName: 'EffectPropertyRequirement', example: 'forbidden' })
  @IsIn(EFFECT_PROPERTY_REQUIREMENTS)
  rounds: EffectPropertyRequirement;

  @ApiProperty({ enum: EFFECT_PROPERTY_REQUIREMENTS, enumName: 'EffectPropertyRequirement', example: 'optional' })
  @IsIn(EFFECT_PROPERTY_REQUIREMENTS)
  text: EffectPropertyRequirement;

  @ApiProperty({ enum: EFFECT_PROPERTY_REQUIREMENTS, enumName: 'EffectPropertyRequirement', example: 'forbidden' })
  @IsIn(EFFECT_PROPERTY_REQUIREMENTS)
  location: EffectPropertyRequirement;

  @ApiProperty({ enum: EFFECT_PROPERTY_REQUIREMENTS, enumName: 'EffectPropertyRequirement', example: 'forbidden' })
  @IsIn(EFFECT_PROPERTY_REQUIREMENTS)
  delay: EffectPropertyRequirement;

  @ApiProperty({ description: 'Access type of the effect type', example: 'public' })
  @IsIn(['public', 'private'])
  accessType: AccessType;

  static toCommand(dto: CreateEffectTypeDto, userId: string, roles: string[]): CreateEffectTypeCommand {
    return new CreateEffectTypeCommand(
      dto.id,
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
