import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../shared/infrastructure/security/jwt-auth.guard.js';
import { Race } from '../../domain/aggregates/race.js';
import { RaceDto, RacePageDto } from './dto/race.dto.js';
import { CreateRaceDto } from './dto/create-race.dto.js';
import { DeleteRaceCommand } from '../../application/cqrs/commands/delete-race.command.js';
import { GetRaceQuery } from '../../application/cqrs/queries/get-race.query.js';
import { GetRacesQuery } from '../../application/cqrs/queries/get-races.query.js';
import { UpdateRaceDto } from './dto/update-race.dto.js';
import { Page } from '../../../shared/domain/entities/page.js';
import { ErrorDto } from '../../../shared/interfaces/http/dto/error-dto.js';
import { PagedQueryDto } from '../../../shared/interfaces/http/dto/paged-rsql-query.js';
import { AddRaceTraitDto } from './dto/add-race-trait.dto.js';
import { DeleteRaceTraitCommand } from '../../application/cqrs/commands/delete-race-trait.command.js';
import { AddRaceSkillBonusDto } from './dto/add-race-skill-bonus.dto.js';
import { AddRaceSkillBonusCommand } from '../../application/cqrs/commands/add-race-skill-bonus.command.js';
import { CreateRaceCommand } from '../../application/cqrs/commands/create-race.command.js';
import { AddRaceTraitCommand } from '../../application/cqrs/commands/add-race-trait.command.js';
import { UpdateRaceCommand } from '../../application/cqrs/commands/update-race.command.js';
import { DeleteRaceSkillBonusCommand } from '../../application/cqrs/commands/delete-race-skill-bonus.command.js';
import type { AuthenticatedRequest } from '../../../shared/interfaces/http/authenticated-request.js';

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
  async findById(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    const userId: string = req.user.id;
    const roles: string[] = req.user.roles;
    const query = new GetRaceQuery(id, userId, roles);
    const entity = await this.queryBus.execute<GetRaceQuery, Race>(query);
    return RaceDto.fromEntity(entity);
  }

  @Get('')
  @ApiOperation({ operationId: 'findRaces', summary: 'Find races by RSQL' })
  @ApiOkResponse({ type: RacePageDto })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing authentication token', type: ErrorDto })
  @ApiResponse({ status: 400, description: 'Invalid RSQL query', type: ErrorDto })
  async find(@Query() dto: PagedQueryDto, @Request() req: AuthenticatedRequest) {
    const userId: string = req.user.id;
    const roles: string[] = req.user.roles;
    const query = new GetRacesQuery(dto.q, dto.page, dto.size, userId, roles);
    const page = await this.queryBus.execute<GetRacesQuery, Page<Race>>(query);
    const mapped = page.content.map(race => RaceDto.fromEntity(race));
    return new Page<RaceDto>(mapped, page.pagination.page, page.pagination.size, page.pagination.totalElements);
  }

  @Post('')
  @ApiOperation({ operationId: 'createRace', summary: 'Create a new race' })
  @ApiOkResponse({ type: RaceDto, description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing authentication token', type: ErrorDto })
  @ApiResponse({ status: 400, description: 'Bad request, invalid data', type: ErrorDto })
  @ApiResponse({ status: 409, description: 'Conflict, race already exists', type: ErrorDto })
  async create(@Body() createRaceDto: CreateRaceDto, @Request() req: AuthenticatedRequest) {
    const userId: string = req.user.id;
    const roles: string[] = req.user.roles;
    const command = CreateRaceDto.toCommand(createRaceDto, userId, roles);
    const entity = await this.commandBus.execute<CreateRaceCommand, Race>(command);
    return RaceDto.fromEntity(entity);
  }

  @Patch(':id')
  @ApiOperation({ operationId: 'updateRace', summary: 'Update race by id' })
  @ApiOkResponse({ type: RaceDto, description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing authentication token', type: ErrorDto })
  @ApiNotFoundResponse({ description: 'Race not found', type: ErrorDto })
  @ApiResponse({ status: 400, description: 'Bad request, invalid data', type: ErrorDto })
  async updateSettings(@Param('id') id: string, @Body() updateRaceDto: UpdateRaceDto, @Request() req: AuthenticatedRequest) {
    const userId = req.user.id;
    const roles = req.user.roles;
    const command = UpdateRaceDto.toCommand(id, updateRaceDto, userId, roles);
    const entity = this.commandBus.execute<UpdateRaceCommand, Race>(command);
    return RaceDto.fromEntity(await entity);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ operationId: 'deleteRace', summary: 'Delete race by id' })
  @ApiNotFoundResponse({ description: 'Race not found', type: ErrorDto })
  async delete(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    const userId = req.user.id;
    const roles = req.user.roles;
    const command = new DeleteRaceCommand(id, userId, roles);
    await this.commandBus.execute(command);
  }

  @Post(':id/traits')
  @HttpCode(200)
  @ApiOperation({ operationId: 'addTrait', summary: 'Add a trait to a race' })
  @ApiOkResponse({ type: RaceDto, description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing authentication token', type: ErrorDto })
  @ApiResponse({ status: 400, description: 'Bad request, invalid data', type: ErrorDto })
  @ApiResponse({ status: 409, description: 'Conflict, race already exists', type: ErrorDto })
  async addTrait(@Param('id') id: string, @Body() addRaceTraitDto: AddRaceTraitDto, @Request() req: AuthenticatedRequest) {
    const userId = req.user.id;
    const roles = req.user.roles;
    const command = AddRaceTraitDto.toCommand(id, addRaceTraitDto, userId, roles);
    const entity = await this.commandBus.execute<AddRaceTraitCommand, Race>(command);
    return RaceDto.fromEntity(entity);
  }

  @Post(':id/skill-bonuses')
  @HttpCode(200)
  @ApiOperation({ operationId: 'addSkillBonus', summary: 'Add a skill bonus to a race' })
  @ApiOkResponse({ type: RaceDto, description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing authentication token', type: ErrorDto })
  @ApiResponse({ status: 400, description: 'Bad request, invalid data', type: ErrorDto })
  @ApiResponse({ status: 409, description: 'Conflict, race already exists', type: ErrorDto })
  async addSkillBonus(@Param('id') id: string, @Body() dto: AddRaceSkillBonusDto, @Request() req: AuthenticatedRequest) {
    const userId = req.user.id;
    const roles = req.user.roles;
    const command = AddRaceSkillBonusDto.toCommand(id, dto, userId, roles);
    const entity = await this.commandBus.execute<AddRaceSkillBonusCommand, Race>(command);
    return RaceDto.fromEntity(entity);
  }

  @Delete(':id/traits/:traitId')
  @HttpCode(200)
  @ApiOperation({ operationId: 'removeTrait', summary: 'Remove a trait from a race' })
  @ApiOkResponse({ type: RaceDto, description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing authentication token', type: ErrorDto })
  @ApiNotFoundResponse({ description: 'Race or trait not found', type: ErrorDto })
  async removeTrait(@Param('id') id: string, @Param('traitId') traitId: string, @Request() req: AuthenticatedRequest) {
    const userId = req.user.id;
    const roles = req.user.roles;
    const command = new DeleteRaceTraitCommand(id, traitId, userId, roles);
    const entity = await this.commandBus.execute<DeleteRaceTraitCommand, Race>(command);
    return RaceDto.fromEntity(entity);
  }

  @Delete(':id/skill-bonuses/:skillId')
  @HttpCode(200)
  @ApiOperation({ operationId: 'removeSkillBonus', summary: 'Remove a skill bonus from a race' })
  @ApiOkResponse({ type: RaceDto, description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing authentication token', type: ErrorDto })
  @ApiNotFoundResponse({ description: 'Race or skill bonus not found', type: ErrorDto })
  async removeSkillBonus(
    @Param('id') id: string,
    @Param('skillId') skillId: string,
    @Query('specialization') specialization: string | null,
    @Request() req: AuthenticatedRequest,
  ) {
    const userId = req.user.id;
    const roles = req.user.roles;
    const command = new DeleteRaceSkillBonusCommand(id, skillId, specialization, userId, roles);
    const entity = await this.commandBus.execute<DeleteRaceSkillBonusCommand, Race>(command);
    return RaceDto.fromEntity(entity);
  }
}
