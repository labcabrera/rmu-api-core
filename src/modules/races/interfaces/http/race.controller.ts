/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt.auth.guard';
import { PagedQueryDto } from '../../../core/interfaces/http/dto/paged-rsql-query';
import { Page } from '../../../core/domain/entities/page';
import { Race } from '../../domain/aggregates/race';
import { RaceDto, RacePageDto } from './dtos/race.dto';
import { CreateRaceDto } from './dtos/create-race.dto';
import { ErrorDto } from 'src/modules/core/interfaces/http/dto/error-dto';
import { DeleteRaceCommand } from '../../application/cqrs/commands/delete-race.command';
import { GetRaceQuery } from '../../application/cqrs/queries/get-race.query';
import { GetRacesQuery } from '../../application/cqrs/queries/get-races.query';
import { UpdateRaceDto } from './dtos/update-race.dto';

@UseGuards(JwtAuthGuard)
@Controller('v1/races')
@ApiTags('Races')
export class RaceController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get(':id')
  @ApiOperation({ operationId: 'findRaceById', summary: 'Find race by id' })
  @ApiOkResponse({ type: RaceDto })
  @ApiNotFoundResponse({ description: 'Race not found', type: ErrorDto })
  async findById(@Param('id') id: string, @Request() req) {
    const entity = await this.queryBus.execute<GetRaceQuery, Race>(new GetRaceQuery(id, req.user!.id as string));
    return RaceDto.fromEntity(entity);
  }

  @Get('')
  @ApiOperation({ operationId: 'findRaces', summary: 'Find races by RSQL' })
  @ApiOkResponse({ type: RacePageDto })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing authentication token', type: ErrorDto })
  @ApiResponse({ status: 400, description: 'Invalid RSQL query', type: ErrorDto })
  async find(@Query() dto: PagedQueryDto, @Request() req) {
    const userId: string = req.user!.id as string;
    const query = new GetRacesQuery(dto.q, dto.page, dto.size, userId);
    const page = await this.queryBus.execute<GetRacesQuery, Page<Race>>(query);
    const mapped = page.content.map((race) => RaceDto.fromEntity(race));
    return new Page<RaceDto>(mapped, page.pagination.page, page.pagination.size, page.pagination.totalElements);
  }

  @Post('')
  @ApiOperation({ operationId: 'createRace', summary: 'Create a new race' })
  @ApiOkResponse({ type: RaceDto, description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing authentication token', type: ErrorDto })
  @ApiResponse({ status: 400, description: 'Bad request, invalid data', type: ErrorDto })
  @ApiResponse({ status: 409, description: 'Conflict, race already exists', type: ErrorDto })
  create(@Body() createRaceDto: CreateRaceDto, @Request() req) {
    const command = CreateRaceDto.toCommand(createRaceDto, req.user!.id as string, req.user!.roles as string[]);
    return this.commandBus.execute(command);
  }

  @Patch(':id')
  @ApiOperation({ operationId: 'updateRace', summary: 'Update race by id' })
  @ApiOkResponse({ type: RaceDto, description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing authentication token', type: ErrorDto })
  @ApiNotFoundResponse({ description: 'Race not found', type: ErrorDto })
  @ApiResponse({ status: 400, description: 'Bad request, invalid data', type: ErrorDto })
  updateSettings(@Param('id') id: string, @Body() updateRaceDto: UpdateRaceDto, @Request() req) {
    const user = req.user!;
    const command = UpdateRaceDto.toCommand(id, updateRaceDto, user.id as string, user.roles as string[]);
    return this.commandBus.execute(command);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ operationId: 'deleteRace', summary: 'Delete race by id' })
  @ApiNotFoundResponse({ description: 'Race not found', type: ErrorDto })
  async delete(@Param('id') id: string, @Request() req) {
    const command = new DeleteRaceCommand(id, undefined, req.user!.id as string, req.user!.roles as string[]);
    await this.commandBus.execute(command);
  }
}
