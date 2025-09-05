import { ApiProperty } from '@nestjs/swagger';
import * as am from 'src/modules/maneuvers/domain/entities/absolute-maneuver-result.entity';

export class AbsoluteManeuverResultDto {
  @ApiProperty({ description: 'The result value', example: 'success', required: true })
  result: am.AbsoluteManeuverResultType;

  @ApiProperty({ description: 'The critical severity level', example: 'A', required: false })
  message: string;

  static fromEntity(entity: am.AbsoluteManeuverResult) {
    const dto = new AbsoluteManeuverResultDto();
    dto.result = entity.result;
    dto.message = entity.message;
    return dto;
  }
}
