import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { ACCESS_LEVELS, type AccessLevel } from '../../../../shared/domain/services/entity-access.js';

/** One realm a user reads, with the level (spec 073). */
export class RealmLevelDto {
  @ApiProperty({ description: 'Realm id' })
  realmId: string;

  @ApiProperty({ enum: ACCESS_LEVELS, description: 'Access of the user as a non-admin, with the strategic games (spec 071)' })
  level: AccessLevel;
}

export class RealmAccessMapQueryDto {
  @ApiProperty({ description: 'User the access is about' })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
