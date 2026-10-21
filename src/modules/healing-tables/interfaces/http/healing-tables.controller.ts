/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../shared/infrastructure/security/jwt-auth.guard';
import { ErrorDto } from '../../../shared/interfaces/http/dto/error-dto';
import { GetHealingTablesQuery } from '../../application/cqrs/queries/get-healing-tables.query';
import { HealingTables } from '../../domain/value-objects/healing-tables.vo';
import { HealingTablesDto } from './dto/healing-tables.dto';

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
  @ApiUnauthorizedResponse({ description: 'Invalid or missing authentication token', type: ErrorDto })
  @ApiForbiddenResponse({ description: 'The user has no Core Law access', type: ErrorDto })
  @ApiNotFoundResponse({ description: 'The healing tables have not been imported', type: ErrorDto })
  async getHealingTables(@Request() req): Promise<HealingTablesDto> {
    const user = req.user!;
    const query = new GetHealingTablesQuery(user.id as string, user.roles as string[]);
    const tables = await this.queryBus.execute<GetHealingTablesQuery, HealingTables>(query);
    return HealingTablesDto.fromEntity(tables);
  }
}
