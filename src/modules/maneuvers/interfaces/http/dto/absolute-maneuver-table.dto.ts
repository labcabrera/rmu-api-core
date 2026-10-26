import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { AbsoluteManeuverTable } from '../../../domain/value-objects/absolute-maneuver-table.vo.js';
import { AbsoluteManeuverResultDto } from './absolute-maneuver-result.dto.js';

export class AbsoluteManeuverTableEntryDto {
  @ApiProperty({ description: 'Min roll', type: Number, example: '12', required: false })
  @IsNumber()
  min: number | null;

  @ApiProperty({ description: 'Max roll', type: Number, example: '42', required: false })
  @IsNumber()
  max: number | null;

  @ApiProperty({ description: 'Table result', type: AbsoluteManeuverResultDto, required: false })
  result: AbsoluteManeuverResultDto;
}

export class AbsoluteManeuverTableDto {
  @ApiProperty({ description: 'Table name', example: 'generic', required: true })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Table entries', type: [AbsoluteManeuverTableEntryDto] })
  table: AbsoluteManeuverTableEntryDto[];

  @ApiProperty({ description: 'Unusual event description', example: 'Some effect.', required: true })
  unusualEvent: string;

  @ApiProperty({ description: 'Translations of unusualEvent by language code', example: { es: 'Algún efecto.' }, required: false })
  unusualEventTranslations?: Record<string, string>;

  static fromEntity(entity: AbsoluteManeuverTable): AbsoluteManeuverTableDto {
    const dto = new AbsoluteManeuverTableDto();
    dto.name = entity.name;
    dto.table = entity.table.map(entry => {
      const e = new AbsoluteManeuverTableEntryDto();
      e.min = entry.min;
      e.max = entry.max;
      e.result = AbsoluteManeuverResultDto.fromEntity(entry.result);
      return e;
    });
    dto.unusualEvent = entity.unusualEvent;
    dto.unusualEventTranslations = entity.unusualEventTranslations;
    return dto;
  }
}
