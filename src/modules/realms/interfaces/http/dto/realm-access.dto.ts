import { ApiProperty } from '@nestjs/swagger';
import { ACCESS_LEVELS, type AccessLevel } from '../../../../shared/domain/services/entity-access.js';

export class RealmAccessDto {
  @ApiProperty({ description: 'Realm id' })
  realmId: string;

  @ApiProperty({ description: 'User the access is about' })
  userId: string;

  @ApiProperty({ enum: ACCESS_LEVELS, description: 'Access of the user as a non-admin, with the strategic games (spec 071)' })
  level: AccessLevel;
}
