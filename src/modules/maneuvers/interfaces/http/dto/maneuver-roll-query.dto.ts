import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt } from 'class-validator';

/**
 * The roll of a maneuver: the open-ended roll plus every bonus, so any integer (the tables cover all of them).
 * A missing, non-numeric or decimal roll is a 400 here instead of a roll that fits no row of the table.
 */
export class ManeuverRollQueryDto {
  @ApiProperty({ type: Number, description: 'Total roll (open-ended roll plus bonuses), an integer', example: 75 })
  // Reads the raw query value (obj[key]), so an empty `roll=` stays a 400 instead of Number('') = 0.
  @Transform(({ obj, key }: { obj: Record<string, unknown>; key: string }) => {
    const raw = obj[key];
    return typeof raw === 'string' && raw.trim() !== '' ? Number(raw) : raw;
  })
  @IsInt()
  roll: number;
}
