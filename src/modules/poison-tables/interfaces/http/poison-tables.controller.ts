import { Controller, Get, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../shared/infrastructure/security/jwt-auth.guard.js';
import { GetPoisonTablesQuery } from '../../application/cqrs/queries/get-poison-tables.query.js';
import type { PoisonTables } from '../../domain/value-objects/poison-tables.vo.js';
import { PoisonTablesDto } from './dto/poison-tables.dto.js';
import type { AuthenticatedUser } from '../../../shared/interfaces/http/authenticated-request.js';
import { CurrentUser } from '../../../shared/interfaces/http/current-user.decorator.js';
import { ApiErrors } from '../../../shared/interfaces/http/api-errors.decorator.js';

@UseGuards(JwtAuthGuard)
@Controller('v1/poison-tables')
@ApiTags('Poison tables')
export class PoisonTablesController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('')
  @ApiOperation({
    operationId: 'getPoisonTables',
    summary: 'Get the poison tables',
    description:
      'General effects of each poison category by severity (onset, duration, penalty, hits, condition). Requires Core Law access.',
  })
  @ApiOkResponse({ type: PoisonTablesDto, description: 'Success' })
  @ApiErrors({ 403: 'The user has no Core Law access', 404: 'The poison tables have not been imported' })
  async getPoisonTables(@CurrentUser() user: AuthenticatedUser): Promise<PoisonTablesDto> {
    const query = new GetPoisonTablesQuery(user.id, user.roles);
    const tables = await this.queryBus.execute<GetPoisonTablesQuery, PoisonTables>(query);
    return PoisonTablesDto.fromEntity(tables);
  }
}
