import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString, IsInt, Min } from 'class-validator';
import { UpdateManeuverModifierCommand } from '../../../application/cqrs/commands/update-maneuver-modifier.command.js';
import { MANEUVER_MODIFIER_TYPES } from '../../../domain/value-objects/maneuver-modifier-type.vo.js';
import type { ManeuverModifierType } from '../../../domain/value-objects/maneuver-modifier-type.vo.js';
import type { AccessType } from '../../../../shared/domain/entities/access-type.js';
import { ManeuverModifierDefinitionFields } from './maneuver-modifier.dto.js';

export class UpdateManeuverModifierDto extends PartialType(ManeuverModifierDefinitionFields) {
  @ApiProperty({ required: false })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  key?: string;

  @ApiProperty({ enum: MANEUVER_MODIFIER_TYPES, required: false })
  @IsIn(MANEUVER_MODIFIER_TYPES)
  @IsOptional()
  type?: ManeuverModifierType;

  @ApiProperty({ type: String, required: false })
  @IsIn(['public', 'private'])
  @IsOptional()
  accessType?: AccessType;

  @ApiProperty({ description: 'Version the client read (from the GET); a different stored version is a 409', required: false, example: 3 })
  @IsInt()
  @Min(0)
  @IsOptional()
  version?: number;

  static toCommand(id: string, dto: UpdateManeuverModifierDto, userId: string, roles: string[]): UpdateManeuverModifierCommand {
    return new UpdateManeuverModifierCommand(
      id,
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
        accessType: dto.accessType,
      },
      userId,
      roles,
      dto.version,
    );
  }
}
