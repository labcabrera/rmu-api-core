import { ApiProperty } from '@nestjs/swagger';
import { SHARE_LEVELS, type EntityShare, type ShareLevel } from '../../../domain/entities/entity-share.js';

/** One access given by the owner of an entity (spec 069). */
export class EntityShareDto {
  @ApiProperty({ description: 'User the entity is shared with', example: '7b1c…' })
  userId: string;

  @ApiProperty({ description: 'Name of that user when it was shared (display only)', example: 'bea' })
  userName: string;

  @ApiProperty({ enum: SHARE_LEVELS, description: 'read, or read and write', example: 'write' })
  level: ShareLevel;

  @ApiProperty({ description: 'When it was shared', example: '2026-11-02T10:00:00.000Z' })
  grantedAt: Date;

  static fromShare(share: EntityShare): EntityShareDto {
    return Object.assign(new EntityShareDto(), {
      userId: share.userId,
      userName: share.userName,
      level: share.level,
      grantedAt: share.grantedAt,
    });
  }
}
