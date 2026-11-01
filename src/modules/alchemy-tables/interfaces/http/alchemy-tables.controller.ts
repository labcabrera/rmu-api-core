import { Controller, Get, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../shared/infrastructure/security/jwt-auth.guard.js';
import { GetAlchemyTablesQuery } from '../../application/cqrs/queries/get-alchemy-tables.query.js';
import type { AlchemyTables } from '../../domain/value-objects/alchemy-tables.vo.js';
import { AlchemyTablesDto } from './dto/alchemy-tables.dto.js';
import type { AuthenticatedUser } from '../../../shared/interfaces/http/authenticated-request.js';
import { CurrentUser } from '../../../shared/interfaces/http/current-user.decorator.js';
import { ApiErrors } from '../../../shared/interfaces/http/api-errors.decorator.js';

@UseGuards(JwtAuthGuard)
@Controller('v1/alchemy-tables')
@ApiTags('Alchemy tables')
export class AlchemyTablesController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('')
  @ApiOperation({
    operationId: 'getAlchemyTables',
    summary: 'Get the alchemy tables',
    description:
      'The ten alchemical failure tables (rows by failure roll, with the serendipity results) and the cost multipliers ' +
      'of the power levels. Requires Core Law access.',
  })
  @ApiOkResponse({ type: AlchemyTablesDto, description: 'Success' })
  @ApiErrors({ 403: 'The user has no Core Law access', 404: 'The alchemy tables have not been imported (alchemy-tables-not-found)' })
  async getAlchemyTables(@CurrentUser() user: AuthenticatedUser): Promise<AlchemyTablesDto> {
    const query = new GetAlchemyTablesQuery(user.id, user.roles);
    const tables = await this.queryBus.execute<GetAlchemyTablesQuery, AlchemyTables>(query);
    return AlchemyTablesDto.fromEntity(tables);
  }
}
