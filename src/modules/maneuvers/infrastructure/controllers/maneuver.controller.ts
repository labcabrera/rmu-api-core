/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Body, Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { QueryBus } from '@nestjs/cqrs';

import { JwtAuthGuard } from 'src/modules/auth/jwt.auth.guard';
import { ErrorDto } from '../../../core/interfaces/http/dto/error-dto';
import { PercentManeuverResultDto } from './dtos/percent-maneuver-result.dto';
import { PercentManeuverQuery } from '../../application/queries/percent-maneuver.query';
import { AbsoluteManeuverQuery } from '../../application/queries/absolute-maneuver.query';
import { AbsoluteManeuverResultDto } from './dtos/absolute-maneuver-result.dto';

@UseGuards(JwtAuthGuard)
@Controller('v1/maneuvers')
@ApiTags('Maneuvers')
export class ManeuverController {
  constructor(private queryBus: QueryBus) {}

  @Get('/percent/:roll')
  @ApiOperation({ operationId: 'percentManeuver', summary: 'Get percent maneuver result' })
  @ApiOkResponse({ type: PercentManeuverResultDto, description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing authentication token', type: ErrorDto })
  async percentManeuver(@Param('roll') roll: number, @Request() req): Promise<PercentManeuverResultDto> {
    const user = req.user!;
    const query = new PercentManeuverQuery(roll, user.id as string, user.roles as string[]);
    const entity = await this.queryBus.execute<PercentManeuverQuery, PercentManeuverResultDto>(query);
    return PercentManeuverResultDto.fromEntity(entity);
  }

  @Get('/absolute/:roll')
  @ApiOperation({ operationId: 'absoluteManeuver', summary: 'Get absolute maneuver result' })
  @ApiOkResponse({ type: AbsoluteManeuverResultDto, description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing authentication token', type: ErrorDto })
  async absoluteManeuver(@Param('roll') roll: number, @Request() req): Promise<AbsoluteManeuverResultDto> {
    const user = req.user!;
    const query = new AbsoluteManeuverQuery(roll, undefined, user.id as string, user.roles as string[]);
    const entity = await this.queryBus.execute<AbsoluteManeuverQuery, AbsoluteManeuverResultDto>(query);
    return AbsoluteManeuverResultDto.fromEntity(entity);
  }
}
