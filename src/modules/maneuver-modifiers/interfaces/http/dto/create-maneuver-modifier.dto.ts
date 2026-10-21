import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { CreateManeuverModifierCommand } from '../../../application/cqrs/commands/create-maneuver-modifier.command.js';
import { MANEUVER_MODIFIER_TYPES } from '../../../domain/value-objects/maneuver-modifier-type.vo.js';
import type { ManeuverModifierType } from '../../../domain/value-objects/maneuver-modifier-type.vo.js';
import type { AccessType } from '../../../../shared/domain/entities/access-type.js';
import { ManeuverModifierDefinitionFields } from './maneuver-modifier.dto.js';

export class CreateManeuverModifierDto extends ManeuverModifierDefinitionFields {
  @ApiProperty({ description: 'Unique key', example: 'some-modifier' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ enum: MANEUVER_MODIFIER_TYPES, example: 'flag' })
  @IsIn(MANEUVER_MODIFIER_TYPES)
  type: ManeuverModifierType;

  @ApiProperty({ type: String, example: 'public' })
  @IsIn(['public', 'private'])
  accessType: AccessType;

  static toCommand(dto: CreateManeuverModifierDto, userId: string, roles: string[]): CreateManeuverModifierCommand {
    return new CreateManeuverModifierCommand(
      {
        key: dto.key,
        scope: dto.scope,
        type: dto.type,
        value: dto.value,
        options: dto.options,
        perUnit: dto.perUnit,
        min: dto.min,
        max: dto.max,
        description: dto.description,
      },
      dto.accessType,
      userId,
      roles,
    );
  }
}
