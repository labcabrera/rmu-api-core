import { ApiProperty } from '@nestjs/swagger';
import { CriticalSeverity } from 'src/modules/maneuvers/domain/value-objects/percent-maneuver-result.vo';

export class PercentManeuverResultDto {
  @ApiProperty({ description: 'The percent value', example: 80, required: true })
  percent: number;

  @ApiProperty({ description: 'The critical severity level', example: 'A', required: false })
  critical: CriticalSeverity | undefined;

  @ApiProperty({ description: 'A message describing the result', example: 'Completed at 50%', required: false })
  message: string;

  static fromEntity(entity: PercentManeuverResultDto) {
    const dto = new PercentManeuverResultDto();
    dto.percent = entity.percent;
    dto.critical = entity.critical;
    dto.message = entity.message;
    return dto;
  }
}
