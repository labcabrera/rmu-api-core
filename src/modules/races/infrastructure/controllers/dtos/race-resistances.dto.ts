import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { RaceResistances } from 'src/modules/races/domain/value-objects/race-resistances.vo';

export class RaceResistancesDto {
  @ApiProperty({ description: 'Channeling resistance', example: 0 })
  @IsNumber()
  channeling: number;

  @ApiProperty({ description: 'Mentalism resistance', example: 0 })
  @IsNumber()
  mentalism: number;

  @ApiProperty({ description: 'Essence resistance', example: 10 })
  @IsNumber()
  essence: number;

  @ApiProperty({ description: 'Physical resistance', example: 0 })
  @IsNumber()
  physical: number;

  @ApiProperty({ description: 'Poison resistance', example: 0 })
  @IsNumber()
  poison: number;

  @ApiProperty({ description: 'Disease resistance', example: 0 })
  @IsNumber()
  disease: number;

  @ApiProperty({ description: 'Fear resistance', example: 0 })
  @IsNumber()
  fear: number;

  static fromEntity(resistances: RaceResistances): RaceResistancesDto {
    const dto = new RaceResistancesDto();
    dto.channeling = resistances.channeling ?? 0;
    dto.mentalism = resistances.mentalism ?? 0;
    dto.essence = resistances.essence ?? 0;
    dto.physical = resistances.physical ?? 0;
    dto.poison = resistances.poison ?? 0;
    dto.disease = resistances.disease ?? 0;
    dto.fear = resistances.fear ?? 0;
    return dto;
  }

  static toEntity(dto: RaceResistancesDto): RaceResistances {
    return new RaceResistances(dto.channeling, dto.mentalism, dto.essence, dto.physical, dto.poison, dto.disease, dto.fear);
  }
}
