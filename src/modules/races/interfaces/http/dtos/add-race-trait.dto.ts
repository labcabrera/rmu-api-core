import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { AddRaceTraitCommand } from 'src/modules/races/application/cqrs/commands/add-race-trait.command';

export class AddRaceTraitDto {
  @ApiProperty({ description: 'ID of the trait to add to the race', example: 'trait-123' })
  @IsString()
  traitId: string;

  @ApiProperty({ description: 'Optional modifier for the trait', example: '+2 to strength' })
  @IsString()
  @IsOptional()
  modifier?: string;

  @ApiProperty({ description: 'Optional description for the trait', example: 'Elves have keen senses' })
  @IsString()
  @IsOptional()
  description?: string;

  static toCommand(raceId: string, dto: AddRaceTraitDto, userId: string, userRoles: string[]) {
    return new AddRaceTraitCommand(raceId, dto.traitId, dto.modifier, dto.description, userId, userRoles);
  }
}
