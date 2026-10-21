import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { CreateManeuverModifierCommand } from 'src/modules/maneuver-modifiers/application/cqrs/commands/create-maneuver-modifier.command';
import { MANEUVER_MODIFIER_TYPES } from 'src/modules/maneuver-modifiers/domain/value-objects/maneuver-modifier-type.vo';
import type { ManeuverModifierType } from 'src/modules/maneuver-modifiers/domain/value-objects/maneuver-modifier-type.vo';
import type { AccessType } from 'src/modules/shared/domain/entities/access-type';
import { ManeuverModifierDefinitionFields } from './maneuver-modifier.dto';

export class CreateManeuverModifierDto extends ManeuverModifierDefinitionFields {
  @ApiProperty({ description: 'Unique key', example: 'some-modifier' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ enum: MANEUVER_MODIFIER_TYPES, example: 'flag' })
  @IsIn(MANEUVER_MODIFIER_TYPES)
  type: ManeuverModifierType;

  @ApiProperty({ example: 'public' })
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
