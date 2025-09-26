import { ApiProperty } from '@nestjs/swagger';
import { AbsoluteManeuverResult } from 'src/modules/maneuvers/domain/value-objects/absolute-maneuver-result.vo';
import type { ResultCode } from 'src/modules/maneuvers/domain/value-objects/maneuver-result.vo';

export class AbsoluteManeuverResultDto {
  @ApiProperty({ description: 'The result value', example: 'success', required: true })
  result: ResultCode;

  @ApiProperty({ description: 'The critical severity level', example: 'A', required: false })
  message: string;

  static fromEntity(entity: AbsoluteManeuverResult) {
    const dto = new AbsoluteManeuverResultDto();
    dto.result = entity.result;
    dto.message = entity.message;
    return dto;
  }
}
