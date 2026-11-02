import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class SexBasedAttributeDto {
  @ApiProperty({ description: 'Average height for males', example: 180 })
  @IsNumber()
  male: number;

  @ApiProperty({ description: 'Average height for females', example: 170 })
  @IsNumber()
  female: number;
}
