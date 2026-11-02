import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';
import { PagedQueryDto } from '../../../../shared/interfaces/http/dto/paged-rsql-query.js';
import { REALM_SCOPES, type RealmScope } from '../../../application/cqrs/queries/get-realms.query.js';

export class RealmQueryDto extends PagedQueryDto {
  @ApiPropertyOptional({
    enum: REALM_SCOPES,
    description: 'mine: owned by the user; shared: shared with the user; public: public realms. Omitted: every realm the user reads.',
  })
  @IsIn(REALM_SCOPES)
  @IsOptional()
  scope?: RealmScope;
}
