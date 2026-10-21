import { ApiProperty } from '@nestjs/swagger';
import { AbsoluteManeuverResult } from '../../../domain/value-objects/absolute-maneuver-result.vo';
import type { ManeuverEffect, ManeuverEffectStatus } from '../../../domain/value-objects/maneuver-effect.vo';
import type { ResultCode } from '../../../domain/value-objects/maneuver-result.vo';

export class ManeuverEffectDto {
  @ApiProperty({ description: 'Effect status', example: 'retryBonus' })
  status: ManeuverEffectStatus;

  @ApiProperty({ description: 'Effect value', example: 10, required: false })
  value?: number;

  @ApiProperty({ description: 'Affected modifier', required: false })
  modifier?: string;

  @ApiProperty({ description: 'Duration in rounds', example: 1, required: false })
  rounds?: number;

  @ApiProperty({ description: 'Rounds before the effect applies', example: 1, required: false })
  roundDelay?: number;

  static fromEntity(entity: ManeuverEffect): ManeuverEffectDto {
    return Object.assign(new ManeuverEffectDto(), entity);
  }
}

export class AbsoluteManeuverResultDto {
  @ApiProperty({ description: 'The result value', example: 'success', required: true })
  result: ResultCode;

  @ApiProperty({ description: 'Result text (followed by the unusual event text when requested)', example: 'Success.', required: true })
  message: string;

  @ApiProperty({ description: 'Result effects', type: [ManeuverEffectDto], required: false })
  effects?: ManeuverEffectDto[];

  @ApiProperty({ description: 'Bonus until absolute success is achieved', example: 2, required: false })
  penaltyUntilAbsoluteSuccess?: number;

  @ApiProperty({ description: 'Bonus until absolute failure is achieved', example: 1, required: false })
  bonusUntilAbsoluteFailure?: number;

  @ApiProperty({ description: 'Unusual event text of the table, only when unusualEvent=true', required: false })
  unusualEvent?: string;

  static fromEntity(entity: AbsoluteManeuverResult) {
    const dto = new AbsoluteManeuverResultDto();
    dto.result = entity.result;
    dto.message = entity.message;
    dto.effects = entity.effects?.map(effect => ManeuverEffectDto.fromEntity(effect));
    dto.bonusUntilAbsoluteFailure = entity.bonusUntilAbsoluteFailure;
    dto.penaltyUntilAbsoluteSuccess = entity.penaltyUntilAbsoluteSuccess;
    dto.unusualEvent = entity.unusualEvent;
    return dto;
  }
}
