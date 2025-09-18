import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class RaceStatsDto {
  @ApiProperty({ description: 'Agility bonus', example: 5 })
  @IsNumber()
  ag: number;

  @ApiProperty({ description: 'Constitution bonus', example: 0 })
  @IsNumber()
  co: number;

  @ApiProperty({ description: 'Empathy bonus', example: 0 })
  @IsNumber()
  em: number;

  @ApiProperty({ description: 'Intelligence bonus', example: 5 })
  @IsNumber()
  in: number;

  @ApiProperty({ description: 'Mental endurance bonus', example: 0 })
  @IsNumber()
  me: number;

  @ApiProperty({ description: 'Physical prowess bonus', example: 5 })
  @IsNumber()
  pr: number;

  @ApiProperty({ description: 'Quickness bonus', example: 5 })
  @IsNumber()
  qu: number;

  @ApiProperty({ description: 'Resistance bonus', example: 5 })
  @IsNumber()
  re: number;

  @ApiProperty({ description: 'Stealth bonus', example: 5 })
  @IsNumber()
  sd: number;

  @ApiProperty({ description: 'Strength bonus', example: 5 })
  @IsNumber()
  st: number;

  static fromEntity(entity: RaceStatsDto): RaceStatsDto {
    const dto = new RaceStatsDto();
    dto.ag = entity.ag;
    dto.co = entity.co;
    dto.em = entity.em;
    dto.in = entity.in;
    dto.me = entity.me;
    dto.pr = entity.pr;
    dto.qu = entity.qu;
    dto.re = entity.re;
    dto.sd = entity.sd;
    dto.st = entity.st;
    return dto;
  }
}
