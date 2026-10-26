import { ApiProperty } from '@nestjs/swagger';
import type { EnduranceManeuverResult } from '../../../domain/value-objects/endurance-maneuver-result.vo.js';
import type { ResultCode } from '../../../domain/value-objects/maneuver-result.vo.js';

export class EnduranceManeuverResultDto {
  @ApiProperty({ type: String, description: 'The result value', example: 'success', required: true })
  result: ResultCode;

  @ApiProperty({ description: 'Result text (followed by the unusual event text when requested)', required: true })
  message: string;

  @ApiProperty({ description: 'Translations of message by language code', required: false })
  messageTranslations?: Record<string, string>;

  @ApiProperty({ description: 'The fatigue points. Values over 0 indicate fatigue applied to the character', example: 2, required: true })
  fatigue: number;

  @ApiProperty({ description: 'The hit points. Values over 0 indicate damage taken', example: 5, required: true })
  hitPoints: number;

  @ApiProperty({ description: 'The bonus points. Values over 0 indicate additional benefits', example: 1, required: true })
  bonus: number;

  static fromEntity(entity: EnduranceManeuverResult) {
    const dto = new EnduranceManeuverResultDto();
    dto.result = entity.result;
    dto.message = entity.message;
    dto.messageTranslations = entity.messageTranslations;
    dto.fatigue = entity.fatigue;
    dto.hitPoints = entity.hitPoints;
    dto.bonus = entity.bonus;
    return dto;
  }
}
