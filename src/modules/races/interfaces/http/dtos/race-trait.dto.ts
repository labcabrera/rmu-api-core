import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { RaceTrait } from 'src/modules/races/domain/value-objects/race-trait.vo';

export class RaceTraitDto {
  @ApiProperty({ description: 'Identifier of the race trait', example: 'race-trait-001' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'Trait identifier reference', example: 'ambidextrous' })
  @IsString()
  traitId: string;

  @ApiProperty({ description: 'Specialization of the race trait', required: false, example: 'longbows' })
  @IsString()
  @IsOptional()
  specialization: string | undefined;

  @ApiProperty({ description: 'Indicates if trait is a talent', example: false })
  @IsBoolean()
  isTalent: boolean;

  @ApiProperty({ description: 'Tier level when applicable', required: false, example: 2 })
  @IsNumber()
  @IsOptional()
  tier: number | undefined;

  @ApiProperty({ description: 'Description of the race trait', required: false, example: 'Grants improved reaction speed.' })
  @IsString()
  @IsOptional()
  description?: string;

  static fromEntity(entity: RaceTrait): RaceTraitDto {
    const dto = new RaceTraitDto();
    dto.id = entity.id;
    dto.traitId = entity.traitId;
    dto.specialization = entity.specialization;
    dto.isTalent = entity.isTalent;
    dto.tier = entity.tier;
    dto.description = entity.description;
    return dto;
  }

  static toEntity(dto: RaceTraitDto): RaceTrait {
    return new RaceTrait(dto.id, dto.traitId, dto.specialization, dto.isTalent, dto.tier, dto.description);
  }
}
