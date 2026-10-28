import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../../shared/infrastructure/security/jwt-auth.guard.js';
import { PercentManeuverResultDto } from './dto/percent-maneuver-result.dto.js';
import { PercentManeuverQuery } from '../../application/cqrs/queries/percent-maneuver.query.js';
import { AbsoluteManeuverQuery } from '../../application/cqrs/queries/absolute-maneuver.query.js';
import { AbsoluteManeuverResultDto } from './dto/absolute-maneuver-result.dto.js';
import { EnduranceManeuverResultDto } from './dto/endurance-maneuver-result.dto.js';
import { EnduranceManeuverQuery } from '../../application/cqrs/queries/endurance-maneuver.query.js';
import { AbsoluteManeuverTableDto } from './dto/absolute-maneuver-table.dto.js';
import { AbsoluteManeuverTableProvider } from '../../application/services/absolute-maneuver-table.provider.js';
import type { AuthenticatedUser } from '../../../shared/interfaces/http/authenticated-request.js';
import { CurrentUser } from '../../../shared/interfaces/http/current-user.decorator.js';
import { ApiErrors } from '../../../shared/interfaces/http/api-errors.decorator.js';
import { ManeuverRollQueryDto } from './dto/maneuver-roll-query.dto.js';

@UseGuards(JwtAuthGuard)
@Controller('v1/maneuvers')
@ApiTags('Maneuvers')
export class ManeuverController {
  constructor(
    private tableProvider: AbsoluteManeuverTableProvider,
    private queryBus: QueryBus,
  ) {}

  @Get('/percent')
  @ApiOperation({ operationId: 'percentManeuver', summary: 'Get percent maneuver result' })
  @ApiOkResponse({ type: PercentManeuverResultDto, description: 'Success' })
  @ApiErrors({ 400: 'Missing or non-integer roll' })
  async percentManeuver(
    @Query() rollQuery: ManeuverRollQueryDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<PercentManeuverResultDto> {
    const query = new PercentManeuverQuery(rollQuery.roll, user.id, user.roles);
    const entity = await this.queryBus.execute<PercentManeuverQuery, PercentManeuverResultDto>(query);
    return PercentManeuverResultDto.fromEntity(entity);
  }

  @Get('/absolute')
  @ApiOperation({
    operationId: 'absoluteManeuver',
    summary: 'Get absolute maneuver result',
    description: 'The table is looked up in code first and then in the maneuver-tables collection (default generic).',
  })
  @ApiQuery({ name: 'table', type: String, required: false, example: 'generic' })
  @ApiQuery({ name: 'unusualEvent', type: Boolean, required: false })
  @ApiOkResponse({ type: AbsoluteManeuverResultDto, description: 'Success' })
  @ApiErrors({ 400: 'Missing or non-integer roll', 404: 'Unknown absolute maneuver table' })
  async absoluteManeuver(
    @Query() rollQuery: ManeuverRollQueryDto,
    @Query('unusualEvent') unusualEvent: boolean = false,
    @Query('table') table: string | undefined,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<AbsoluteManeuverResultDto> {
    const query = new AbsoluteManeuverQuery(rollQuery.roll, table, unusualEvent, user.id, user.roles);
    const entity = await this.queryBus.execute<AbsoluteManeuverQuery, AbsoluteManeuverResultDto>(query);
    return AbsoluteManeuverResultDto.fromEntity(entity);
  }

  @Get('/absolute/tables/:tableName')
  @ApiOperation({ operationId: 'absoluteManeuverTable', summary: 'Get absolute maneuver table' })
  @ApiOkResponse({ type: AbsoluteManeuverTableDto, description: 'Success' })
  @ApiErrors({ 404: 'Unknown absolute maneuver table' })
  async absoluteManeuverTable(@Param('tableName') tableName: string): Promise<AbsoluteManeuverTableDto> {
    const table = await this.tableProvider.getTable(tableName);
    return AbsoluteManeuverTableDto.fromEntity(table);
  }

  @Get('/absolute/tables')
  @ApiOperation({ operationId: 'getAbsoluteManeuverTables', summary: 'Get absolute maneuver tables' })
  @ApiOkResponse({ type: [String], description: 'Success' })
  @ApiErrors()
  async getAbsoluteManeuverTables(): Promise<string[]> {
    return await this.tableProvider.getTableNames();
  }

  @Get('/endurance')
  @ApiOperation({ operationId: 'enduranceManeuver', summary: 'Get endurance maneuver result' })
  @ApiOkResponse({ type: EnduranceManeuverResultDto, description: 'Success' })
  @ApiErrors({ 400: 'Missing or non-integer roll' })
  async enduranceManeuver(
    @Query() rollQuery: ManeuverRollQueryDto,
    @Query('unusualEvent') unusualEvent: boolean = false,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<EnduranceManeuverResultDto> {
    const query = new EnduranceManeuverQuery(rollQuery.roll, unusualEvent, user.id, user.roles);
    const entity = await this.queryBus.execute<EnduranceManeuverQuery, EnduranceManeuverResultDto>(query);
    return EnduranceManeuverResultDto.fromEntity(entity);
  }
}
