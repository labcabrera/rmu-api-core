import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../shared/infrastructure/security/jwt-auth.guard.js';
import { Race } from '../../domain/aggregates/race.js';
import { RaceDto, RacePageDto } from './dto/race.dto.js';
import { CreateRaceDto } from './dto/create-race.dto.js';
import { DeleteRaceCommand } from '../../application/cqrs/commands/delete-race.command.js';
import { GetRaceQuery } from '../../application/cqrs/queries/get-race.query.js';
import { GetRacesQuery } from '../../application/cqrs/queries/get-races.query.js';
import { UpdateRaceDto } from './dto/update-race.dto.js';
import { Page } from '../../../shared/application/pagination/page.js';
import { PagedQueryDto } from '../../../shared/interfaces/http/dto/paged-rsql-query.js';
import { AddRaceTraitDto } from './dto/add-race-trait.dto.js';
import { DeleteRaceTraitCommand } from '../../application/cqrs/commands/delete-race-trait.command.js';
import { AddRaceSkillBonusDto } from './dto/add-race-skill-bonus.dto.js';
import { AddRaceSkillBonusCommand } from '../../application/cqrs/commands/add-race-skill-bonus.command.js';
import { CreateRaceCommand } from '../../application/cqrs/commands/create-race.command.js';
import { AddRaceTraitCommand } from '../../application/cqrs/commands/add-race-trait.command.js';
import { UpdateRaceCommand } from '../../application/cqrs/commands/update-race.command.js';
import { DeleteRaceSkillBonusCommand } from '../../application/cqrs/commands/delete-race-skill-bonus.command.js';
import type { AuthenticatedUser } from '../../../shared/interfaces/http/authenticated-request.js';
import { CurrentUser } from '../../../shared/interfaces/http/current-user.decorator.js';
import { ApiErrors } from '../../../shared/interfaces/http/api-errors.decorator.js';

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
  @ApiErrors({ 404: 'Race not found' })
  async findById(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    const userId: string = user.id;
    const roles: string[] = user.roles;
    const query = new GetRaceQuery(id, userId, roles);
    const entity = await this.queryBus.execute<GetRaceQuery, Race>(query);
    return RaceDto.fromEntity(entity);
  }

  @Get('')
  @ApiOperation({ operationId: 'findRaces', summary: 'Find races by RSQL' })
  @ApiOkResponse({ type: RacePageDto })
  @ApiErrors({ 400: 'Invalid RSQL query' })
  async find(@Query() dto: PagedQueryDto, @CurrentUser() user: AuthenticatedUser) {
    const userId: string = user.id;
    const roles: string[] = user.roles;
    const query = new GetRacesQuery(dto.q, dto.page, dto.size, userId, roles);
    const page = await this.queryBus.execute<GetRacesQuery, Page<Race>>(query);
    const mapped = page.content.map(race => RaceDto.fromEntity(race));
    return new Page<RaceDto>(mapped, page.pagination.page, page.pagination.size, page.pagination.totalElements);
  }

  @Post('')
  @ApiOperation({ operationId: 'createRace', summary: 'Create a new race' })
  @ApiOkResponse({ type: RaceDto, description: 'Success' })
  @ApiErrors({
    400: 'Bad request, invalid data or unknown realm',
    403: 'Missing role or no permission to change the realm',
    409: 'Conflict, race already exists',
  })
  async create(@Body() createRaceDto: CreateRaceDto, @CurrentUser() user: AuthenticatedUser) {
    const userId: string = user.id;
    const roles: string[] = user.roles;
    const command = CreateRaceDto.toCommand(createRaceDto, userId, roles);
    const entity = await this.commandBus.execute<CreateRaceCommand, Race>(command);
    return RaceDto.fromEntity(entity);
  }

  @Patch(':id')
  @ApiOperation({ operationId: 'updateRace', summary: 'Update race by id' })
  @ApiOkResponse({ type: RaceDto, description: 'Success' })
  @ApiErrors({ 400: 'Bad request, invalid data', 404: 'Race not found' })
  async updateSettings(@Param('id') id: string, @Body() updateRaceDto: UpdateRaceDto, @CurrentUser() user: AuthenticatedUser) {
    const userId = user.id;
    const roles = user.roles;
    const command = UpdateRaceDto.toCommand(id, updateRaceDto, userId, roles);
    const entity = this.commandBus.execute<UpdateRaceCommand, Race>(command);
    return RaceDto.fromEntity(await entity);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ operationId: 'deleteRace', summary: 'Delete race by id' })
  @ApiErrors({ 404: 'Race not found' })
  async delete(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    const userId = user.id;
    const roles = user.roles;
    const command = new DeleteRaceCommand(id, userId, roles);
    await this.commandBus.execute(command);
  }

  @Post(':id/traits')
  @HttpCode(200)
  @ApiOperation({ operationId: 'addTrait', summary: 'Add a trait to a race' })
  @ApiOkResponse({ type: RaceDto, description: 'Success' })
  @ApiErrors({ 400: 'Bad request, invalid data', 409: 'Conflict, race already exists' })
  async addTrait(@Param('id') id: string, @Body() addRaceTraitDto: AddRaceTraitDto, @CurrentUser() user: AuthenticatedUser) {
    const userId = user.id;
    const roles = user.roles;
    const command = AddRaceTraitDto.toCommand(id, addRaceTraitDto, userId, roles);
    const entity = await this.commandBus.execute<AddRaceTraitCommand, Race>(command);
    return RaceDto.fromEntity(entity);
  }

  @Post(':id/skill-bonuses')
  @HttpCode(200)
  @ApiOperation({ operationId: 'addSkillBonus', summary: 'Add a skill bonus to a race' })
  @ApiOkResponse({ type: RaceDto, description: 'Success' })
  @ApiErrors({ 400: 'Bad request, invalid data', 409: 'Conflict, race already exists' })
  async addSkillBonus(@Param('id') id: string, @Body() dto: AddRaceSkillBonusDto, @CurrentUser() user: AuthenticatedUser) {
    const userId = user.id;
    const roles = user.roles;
    const command = AddRaceSkillBonusDto.toCommand(id, dto, userId, roles);
    const entity = await this.commandBus.execute<AddRaceSkillBonusCommand, Race>(command);
    return RaceDto.fromEntity(entity);
  }

  @Delete(':id/traits/:traitId')
  @HttpCode(200)
  @ApiOperation({ operationId: 'removeTrait', summary: 'Remove a trait from a race' })
  @ApiOkResponse({ type: RaceDto, description: 'Success' })
  @ApiErrors({ 404: 'Race or trait not found' })
  async removeTrait(@Param('id') id: string, @Param('traitId') traitId: string, @CurrentUser() user: AuthenticatedUser) {
    const userId = user.id;
    const roles = user.roles;
    const command = new DeleteRaceTraitCommand(id, traitId, userId, roles);
    const entity = await this.commandBus.execute<DeleteRaceTraitCommand, Race>(command);
    return RaceDto.fromEntity(entity);
  }

  @Delete(':id/skill-bonuses/:skillId')
  @HttpCode(200)
  @ApiOperation({ operationId: 'removeSkillBonus', summary: 'Remove a skill bonus from a race' })
  @ApiOkResponse({ type: RaceDto, description: 'Success' })
  @ApiErrors({ 404: 'Race or skill bonus not found' })
  async removeSkillBonus(
    @Param('id') id: string,
    @Param('skillId') skillId: string,
    @Query('specialization') specialization: string | null,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const userId = user.id;
    const roles = user.roles;
    const command = new DeleteRaceSkillBonusCommand(id, skillId, specialization, userId, roles);
    const entity = await this.commandBus.execute<DeleteRaceSkillBonusCommand, Race>(command);
    return RaceDto.fromEntity(entity);
  }
}
