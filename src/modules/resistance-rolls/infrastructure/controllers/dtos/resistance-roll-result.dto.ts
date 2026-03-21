import { ApiProperty } from '@nestjs/swagger';
import type {
  ResistanceRollResult,
  ResistanceRollResultCode,
} from 'src/modules/resistance-rolls/domain/value-objects/resistance-roll-result';
import { KeyValue } from 'src/modules/shared/domain/entities/key-value';

export class ResistanceRollResultDto {
  @ApiProperty({ description: 'Result code', example: 'success', required: true })
  result: ResistanceRollResultCode;

  @ApiProperty({ description: 'Resistance roll modifiers', example: [{ key: 'bonus', value: 2 }], required: true })
  modifiers: KeyValue[];

  @ApiProperty({ description: 'Total roll result after applying modifiers', example: 15, required: true })
  totalRoll: number;

  static fromEntity(entity: ResistanceRollResult): ResistanceRollResultDto {
    const dto = new ResistanceRollResultDto();
    dto.result = entity.result;
    dto.modifiers = entity.modifiers.map((mod) => ({ key: mod.key, value: mod.value }));
    dto.totalRoll = entity.totalResult;
    return dto;
  }
}
