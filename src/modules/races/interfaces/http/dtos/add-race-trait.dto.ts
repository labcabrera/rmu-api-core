import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { AddRaceTraitCommand } from 'src/modules/races/application/cqrs/commands/add-race-trait.command';

export class AddRaceTraitDto {
  @ApiProperty({ description: 'ID of the trait to add to the race', example: 'trait-123' })
  @IsString()
  traitId: string;

  @ApiProperty({ description: 'Optional specialization for the trait', example: 'longbows' })
  @IsString()
  @IsOptional()
  specialization?: string;

  @ApiProperty({ description: 'Indicates if the trait is talent', example: false })
  @IsBoolean()
  isTalent: boolean;

  @ApiProperty({ description: 'Optional tier level', required: false, example: 2 })
  @IsNumber()
  @IsOptional()
  tier?: number;

  @ApiProperty({ description: 'Optional description for the trait', example: 'Elves have keen senses' })
  @IsString()
  @IsOptional()
  description?: string;

  static toCommand(raceId: string, dto: AddRaceTraitDto, userId: string, userRoles: string[]) {
    return new AddRaceTraitCommand(raceId, dto.traitId, dto.specialization, dto.isTalent, dto.tier, dto.description, userId, userRoles);
  }
}
