/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsInt, Min } from 'class-validator';

export class PagedQueryDto {
  @ApiPropertyOptional({ description: 'RSQL search expression' })
  @IsOptional()
  q?: string;

  @ApiProperty({ description: 'Page', minimum: 0, example: 0, default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') return 0;
    return parseInt(value, 10);
  })
  page: number = 0;

  @ApiProperty({ description: 'Size', minimum: 1, example: 10, default: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') return 10;
    return parseInt(value, 10);
  })
  size: number = 10;
}
