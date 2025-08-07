import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PagedQueryDto {
  @ApiPropertyOptional({ description: 'RSQL search expression' })
  q?: string;

  @ApiProperty({ description: 'Page', minimum: 0, example: 0, default: 0 })
  page: number = 0;

  @ApiProperty({ description: 'Size', minimum: 1, example: 10, default: 10 })
  size: number = 10;
}
