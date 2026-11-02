import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { CreateManeuverModifierCommand } from '../../../application/cqrs/commands/create-maneuver-modifier.command.js';
import { MANEUVER_MODIFIER_TYPES } from '../../../domain/value-objects/maneuver-modifier-type.vo.js';
import type { ManeuverModifierType } from '../../../domain/value-objects/maneuver-modifier-type.vo.js';
import type { AccessType } from '../../../../shared/domain/entities/access-type.js';
import { ManeuverModifierDefinitionFields } from './maneuver-modifier.dto.js';
import { ENTITY_SOURCES, type EntitySource } from '../../../../shared/domain/entities/entity-source.js';

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

  @ApiProperty({
    enum: ENTITY_SOURCES,
    description: 'Source: system (rulebook, only an admin sets it) or user. Missing on create means user',
    required: false,
    example: 'user',
  })
  @IsOptional()
  @IsIn(ENTITY_SOURCES)
  entitySource?: EntitySource;

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
        reference: dto.reference,
      },
      dto.accessType,
      userId,
      roles,
      dto.entitySource,
    );
  }
}
