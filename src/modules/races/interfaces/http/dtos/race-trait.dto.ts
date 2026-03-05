import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { RaceTrait } from 'src/modules/races/domain/value-objects/race-trait.vo';

export class RaceTraitDto {
  @ApiProperty({ description: 'Identifier of the race trait', example: 'race-trait-001' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'Trait identifier reference', example: 'ambidextrous' })
  @IsString()
  traitId: string;

  @ApiProperty({ description: 'Modifier expression of the race trait', required: false, example: '+5 to initiative' })
  @IsString()
  @IsOptional()
  modifier: string | undefined;

  @ApiProperty({ description: 'Description of the race trait', required: false, example: 'Grants improved reaction speed.' })
  @IsString()
  @IsOptional()
  description?: string;

  static fromEntity(entity: RaceTrait): RaceTraitDto {
    const dto = new RaceTraitDto();
    dto.id = entity.id;
    dto.traitId = entity.traitId;
    dto.modifier = entity.modifier;
    dto.description = entity.description;
    return dto;
  }

  static toEntity(dto: RaceTraitDto): RaceTrait {
    return new RaceTrait(dto.id, dto.traitId, dto.modifier, dto.description);
  }
}
