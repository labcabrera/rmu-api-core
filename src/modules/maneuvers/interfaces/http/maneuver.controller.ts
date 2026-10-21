/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Get, Param, Query, Request, UseGuards } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../../shared/infrastructure/security/jwt-auth.guard.js';
import { PercentManeuverResultDto } from './dto/percent-maneuver-result.dto.js';
import { PercentManeuverQuery } from '../../application/cqrs/queries/percent-maneuver.query.js';
import { AbsoluteManeuverQuery } from '../../application/cqrs/queries/absolute-maneuver.query.js';
import { AbsoluteManeuverResultDto } from './dto/absolute-maneuver-result.dto.js';
import { EnduranceManeuverResultDto } from './dto/endurance-maneuver-result.dto.js';
import { EnduranceManeuverQuery } from '../../application/cqrs/queries/endurance-maneuver.query.js';
import { ErrorDto } from '../../../shared/interfaces/http/dto/error-dto.js';
import { AbsoluteManeuverTableDto } from './dto/absolute-maneuver-table.dto.js';
import { AbsoluteManeuverTableProvider } from '../../application/services/absolute-maneuver-table.provider.js';

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
  @ApiUnauthorizedResponse({ description: 'Invalid or missing authentication token', type: ErrorDto })
  async percentManeuver(@Query('roll') roll: number, @Request() req): Promise<PercentManeuverResultDto> {
    const user = req.user!;
    const query = new PercentManeuverQuery(roll, user.id as string, user.roles as string[]);
    const entity = await this.queryBus.execute<PercentManeuverQuery, PercentManeuverResultDto>(query);
    return PercentManeuverResultDto.fromEntity(entity);
  }

  @Get('/absolute')
  @ApiOperation({
    operationId: 'absoluteManeuver',
    summary: 'Get absolute maneuver result',
    description: 'The table is looked up in code first and then in the maneuver-tables collection (default generic).',
  })
  @ApiQuery({ name: 'roll', type: Number, required: true })
  @ApiQuery({ name: 'table', type: String, required: false, example: 'generic' })
  @ApiQuery({ name: 'unusualEvent', type: Boolean, required: false })
  @ApiOkResponse({ type: AbsoluteManeuverResultDto, description: 'Success' })
  @ApiNotFoundResponse({ description: 'Unknown absolute maneuver table', type: ErrorDto })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing authentication token', type: ErrorDto })
  async absoluteManeuver(
    @Query('roll') roll: number,
    @Query('unusualEvent') unusualEvent: boolean = false,
    @Query('table') table: string | undefined,
    @Request() req,
  ): Promise<AbsoluteManeuverResultDto> {
    const user = req.user!;
    const query = new AbsoluteManeuverQuery(roll, table, unusualEvent, user.id as string, user.roles as string[]);
    const entity = await this.queryBus.execute<AbsoluteManeuverQuery, AbsoluteManeuverResultDto>(query);
    return AbsoluteManeuverResultDto.fromEntity(entity);
  }

  @Get('/absolute/tables/:tableName')
  @ApiOperation({ operationId: 'absoluteManeuverTable', summary: 'Get absolute maneuver table' })
  @ApiOkResponse({ type: AbsoluteManeuverTableDto, description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing authentication token', type: ErrorDto })
  @ApiNotFoundResponse({ description: 'Unknown absolute maneuver table', type: ErrorDto })
  async absoluteManeuverTable(@Param('tableName') tableName: string): Promise<AbsoluteManeuverTableDto> {
    const table = await this.tableProvider.getTable(tableName);
    return AbsoluteManeuverTableDto.fromEntity(table);
  }

  @Get('/absolute/tables')
  @ApiOperation({ operationId: 'getAbsoluteManeuverTables', summary: 'Get absolute maneuver tables' })
  @ApiOkResponse({ type: [String], description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing authentication token', type: ErrorDto })
  async getAbsoluteManeuverTables(): Promise<string[]> {
    return await this.tableProvider.getTableNames();
  }

  @Get('/endurance')
  @ApiOperation({ operationId: 'enduranceManeuver', summary: 'Get endurance maneuver result' })
  @ApiOkResponse({ type: EnduranceManeuverResultDto, description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing authentication token', type: ErrorDto })
  async enduranceManeuver(
    @Query('roll') roll: number,
    @Query('unusualEvent') unusualEvent: boolean = false,
    @Request() req,
  ): Promise<EnduranceManeuverResultDto> {
    const user = req.user!;
    const query = new EnduranceManeuverQuery(roll, unusualEvent, user.id as string, user.roles as string[]);
    const entity = await this.queryBus.execute<EnduranceManeuverQuery, EnduranceManeuverResultDto>(query);
    return EnduranceManeuverResultDto.fromEntity(entity);
  }
}
