import { Controller, Get, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../shared/infrastructure/security/jwt-auth.guard.js';
import { GetPsychologyTablesQuery } from '../../application/cqrs/queries/get-psychology-tables.query.js';
import type { PsychologyTables } from '../../domain/value-objects/psychology-tables.vo.js';
import { PsychologyTablesDto } from './dto/psychology-tables.dto.js';
import type { AuthenticatedUser } from '../../../shared/interfaces/http/authenticated-request.js';
import { CurrentUser } from '../../../shared/interfaces/http/current-user.decorator.js';
import { ApiErrors } from '../../../shared/interfaces/http/api-errors.decorator.js';

@UseGuards(JwtAuthGuard)
@Controller('v1/psychology-tables')
@ApiTags('Psychology tables')
export class PsychologyTablesController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('')
  @ApiOperation({
    operationId: 'getPsychologyTables',
    summary: 'Get the psychology tables',
    description: 'Fright levels, fear results, morale and rally tables, and the resistance roll table. Requires Core Law access.',
  })
  @ApiOkResponse({ type: PsychologyTablesDto, description: 'Success' })
  @ApiErrors({ 403: 'The user has no Core Law access', 404: 'The psychology tables have not been imported' })
  async getPsychologyTables(@CurrentUser() user: AuthenticatedUser): Promise<PsychologyTablesDto> {
    const query = new GetPsychologyTablesQuery(user.id, user.roles);
    const tables = await this.queryBus.execute<GetPsychologyTablesQuery, PsychologyTables>(query);
    return PsychologyTablesDto.fromEntity(tables);
  }
}
