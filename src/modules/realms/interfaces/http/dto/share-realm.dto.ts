import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsInt, IsOptional, Min } from 'class-validator';
import { SHARE_LEVELS, type ShareLevel } from '../../../../shared/domain/entities/entity-share.js';

export class ShareRealmDto {
  @ApiProperty({ enum: SHARE_LEVELS, description: 'read, or read and write (no effect on a system realm: only admins change it)' })
  @IsIn(SHARE_LEVELS)
  level: ShareLevel;

  @ApiPropertyOptional({ description: 'Version of the realm the client read: a stale one answers 409', example: 3 })
  @IsInt()
  @Min(0)
  @IsOptional()
  version?: number;
}
