/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Body, Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { JwtAuthGuard } from 'src/modules/auth/jwt.auth.guard';
import { ErrorDto } from '../../../core/infrastructure/controllers/dto/error-dto';
import { PercentManeuverResultDto } from './dtos/percent-maneuver-result.dto';
import { PercentManeuverQuery } from '../../application/commands/percent-maneuver.query';

@UseGuards(JwtAuthGuard)
@Controller('v1/maneuvers')
@ApiTags('Maneuvers')
export class ManeuverController {
  constructor(private queryBus: QueryBus) {}

  @Get('/percent/:roll')
  @ApiOperation({ operationId: 'findRealmById', summary: 'Find realm by id' })
  @ApiOkResponse({ type: PercentManeuverResultDto, description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing authentication token', type: ErrorDto })
  async findById(@Param('roll') roll: number, @Request() req) {
    const user = req.user!;
    const query = new PercentManeuverQuery(roll, user.id as string, user.roles as string[]);
    const entity = await this.queryBus.execute<PercentManeuverQuery, PercentManeuverResultDto>(query);
    return PercentManeuverResultDto.fromEntity(entity);
  }
}
