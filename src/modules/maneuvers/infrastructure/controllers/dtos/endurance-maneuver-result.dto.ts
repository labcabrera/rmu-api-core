import { ApiProperty } from '@nestjs/swagger';
import { EnduranceManeuverResult } from 'src/modules/maneuvers/domain/value-objects/endurance-maneuver-result.vo';
import type { ResultCode } from 'src/modules/maneuvers/domain/value-objects/maneuver-result.vo';

export class EnduranceManeuverResultDto {
  @ApiProperty({ description: 'The result value', example: 'success', required: true })
  result: ResultCode;

  @ApiProperty({ description: 'The critical severity level', example: 'A', required: false })
  message: string;

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
    dto.fatigue = entity.fatigue;
    dto.hitPoints = entity.hitPoints;
    dto.bonus = entity.bonus;
    return dto;
  }
}
