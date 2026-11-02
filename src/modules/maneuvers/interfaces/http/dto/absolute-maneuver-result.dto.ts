import { ApiProperty } from '@nestjs/swagger';
import type { AbsoluteManeuverResult } from '../../../domain/value-objects/absolute-maneuver-result.vo.js';
import type { ManeuverEffect, ManeuverEffectStatus } from '../../../domain/value-objects/maneuver-effect.vo.js';
import type { ResultCode } from '../../../domain/value-objects/maneuver-result.vo.js';

export class ManeuverEffectDto {
  @ApiProperty({ type: String, description: 'Effect status', example: 'retryBonus' })
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
  @ApiProperty({ type: String, description: 'The result value', example: 'success', required: true })
  result: ResultCode;

  @ApiProperty({ description: 'Result text (followed by the unusual event text when requested)', example: 'Success.', required: true })
  message: string;

  @ApiProperty({ description: 'Translations of message by language code', example: { es: 'Éxito.' }, required: false })
  messageTranslations?: Record<string, string>;

  @ApiProperty({ description: 'Result effects', type: [ManeuverEffectDto], required: false })
  effects?: ManeuverEffectDto[];

  @ApiProperty({ description: 'Penalty until an absolute success is achieved (negative), from the effects', example: -25, required: false })
  penaltyUntilAbsoluteSuccess?: number;

  @ApiProperty({ description: 'Bonus until an absolute failure is achieved, from the effects', example: 10, required: false })
  bonusUntilAbsoluteFailure?: number;

  @ApiProperty({ description: 'Unusual event text of the table, only when unusualEvent=true', required: false })
  unusualEvent?: string;

  @ApiProperty({ description: 'Translations of unusualEvent by language code', required: false })
  unusualEventTranslations?: Record<string, string>;

  static fromEntity(entity: AbsoluteManeuverResult) {
    const dto = new AbsoluteManeuverResultDto();
    dto.result = entity.result;
    dto.message = entity.message;
    dto.messageTranslations = entity.messageTranslations;
    dto.effects = entity.effects?.map(effect => ManeuverEffectDto.fromEntity(effect));
    // The tables keep them as effects; the fields repeat them for the clients that read them directly.
    dto.bonusUntilAbsoluteFailure = entity.bonusUntilAbsoluteFailure ?? effectValue(entity, 'bonusUntilAbsoluteFailure');
    dto.penaltyUntilAbsoluteSuccess = entity.penaltyUntilAbsoluteSuccess ?? effectValue(entity, 'penaltyUntilAbsoluteSuccess');
    dto.unusualEvent = entity.unusualEvent;
    dto.unusualEventTranslations = entity.unusualEventTranslations;
    return dto;
  }
}

function effectValue(
  entity: AbsoluteManeuverResult,
  status: 'penaltyUntilAbsoluteSuccess' | 'bonusUntilAbsoluteFailure',
): number | undefined {
  return entity.effects?.find(effect => effect.status === status)?.value;
}
