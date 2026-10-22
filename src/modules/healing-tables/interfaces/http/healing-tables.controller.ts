import { Controller, Get, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../shared/infrastructure/security/jwt-auth.guard.js';
import { GetHealingTablesQuery } from '../../application/cqrs/queries/get-healing-tables.query.js';
import type { HealingTables } from '../../domain/value-objects/healing-tables.vo.js';
import { HealingTablesDto } from './dto/healing-tables.dto.js';
import type { AuthenticatedUser } from '../../../shared/interfaces/http/authenticated-request.js';
import { CurrentUser } from '../../../shared/interfaces/http/current-user.decorator.js';
import { ApiErrors } from '../../../shared/interfaces/http/api-errors.decorator.js';

@UseGuards(JwtAuthGuard)
@Controller('v1/healing-tables')
@ApiTags('Healing tables')
export class HealingTablesController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('')
  @ApiOperation({
    operationId: 'getHealingTables',
    summary: 'Get the healing tables',
    description: 'Recovery days, severity, type of healing modifiers and permanent injury tables. Requires Core Law access.',
  })
  @ApiOkResponse({ type: HealingTablesDto, description: 'Success' })
  @ApiErrors({ 403: 'The user has no Core Law access', 404: 'The healing tables have not been imported' })
  async getHealingTables(@CurrentUser() user: AuthenticatedUser): Promise<HealingTablesDto> {
    const query = new GetHealingTablesQuery(user.id, user.roles);
    const tables = await this.queryBus.execute<GetHealingTablesQuery, HealingTables>(query);
    return HealingTablesDto.fromEntity(tables);
  }
}
