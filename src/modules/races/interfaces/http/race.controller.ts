/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt.auth.guard';
import { Race } from '../../domain/aggregates/race';
import { RaceDto, RacePageDto } from './dtos/race.dto';
import { CreateRaceDto } from './dtos/create-race.dto';
import { DeleteRaceCommand } from '../../application/cqrs/commands/delete-race.command';
import { GetRaceQuery } from '../../application/cqrs/queries/get-race.query';
import { GetRacesQuery } from '../../application/cqrs/queries/get-races.query';
import { UpdateRaceDto } from './dtos/update-race.dto';
import { Page } from 'src/modules/shared/domain/entities/page';
import { ErrorDto } from 'src/modules/shared/interfaces/http/dto/error-dto';
import { PagedQueryDto } from 'src/modules/shared/interfaces/http/dto/paged-rsql-query';
import { AddRaceTraitDto } from './dtos/add-race-trait.dto';
import { DeleteRaceTraitCommand } from '../../application/cqrs/commands/delete-race-trait.command';
import { AddRaceSkillBonusDto } from './dtos/add-race-skill-bonus.dto';
import { AddRaceSkillBonusCommand } from '../../application/cqrs/commands/add-race-skill-bonus.command';
import { CreateRaceCommand } from '../../application/cqrs/commands/create-race.command';
import { AddRaceTraitCommand } from '../../application/cqrs/commands/add-race-trait.command';
import { UpdateRaceCommand } from '../../application/cqrs/commands/update-race.command';
import { DeleteRaceSkillBonusCommand } from '../../application/cqrs/commands/delete-race-skill-bonus.command';

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
    const userId: string = req.user!.id as string;
    const roles: string[] = req.user!.roles as string[];
    const query = new GetRaceQuery(id, userId, roles);
    const entity = await this.queryBus.execute<GetRaceQuery, Race>(query);
    return RaceDto.fromEntity(entity);
  }

  @Get('')
  @ApiOperation({ operationId: 'findRaces', summary: 'Find races by RSQL' })
  @ApiOkResponse({ type: RacePageDto })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing authentication token', type: ErrorDto })
  @ApiResponse({ status: 400, description: 'Invalid RSQL query', type: ErrorDto })
  async find(@Query() dto: PagedQueryDto, @Request() req) {
    const userId: string = req.user!.id as string;
    const roles: string[] = req.user!.roles as string[];
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
  async create(@Body() createRaceDto: CreateRaceDto, @Request() req) {
    const userId: string = req.user!.id as string;
    const roles: string[] = req.user!.roles as string[];
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
  async updateSettings(@Param('id') id: string, @Body() updateRaceDto: UpdateRaceDto, @Request() req) {
    const userId = req.user! as string;
    const roles = req.user!.roles as string[];
    const command = UpdateRaceDto.toCommand(id, updateRaceDto, userId, roles);
    const entity = this.commandBus.execute<UpdateRaceCommand, Race>(command);
    return RaceDto.fromEntity(await entity);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ operationId: 'deleteRace', summary: 'Delete race by id' })
  @ApiNotFoundResponse({ description: 'Race not found', type: ErrorDto })
  async delete(@Param('id') id: string, @Request() req) {
    const userId = req.user! as string;
    const roles = req.user!.roles as string[];
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
  async addTrait(@Param('id') id: string, @Body() addRaceTraitDto: AddRaceTraitDto, @Request() req) {
    const userId = req.user! as string;
    const roles = req.user!.roles as string[];
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
  async addSkillBonus(@Param('id') id: string, @Body() dto: AddRaceSkillBonusDto, @Request() req) {
    const userId = req.user! as string;
    const roles = req.user!.roles as string[];
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
  async removeTrait(@Param('id') id: string, @Param('traitId') traitId: string, @Request() req) {
    const userId = req.user! as string;
    const roles = req.user!.roles as string[];
    const command = new DeleteRaceTraitCommand(id, traitId, userId, roles);
    const entity = await this.commandBus.execute<DeleteRaceTraitCommand, Race>(command);
    return RaceDto.fromEntity(entity);
  }

  @Delete(':id/skill-bonuses/:skillId')
  @HttpCode(200)
  @ApiOperation({ operationId: 'removeTrait', summary: 'Remove a trait from a race' })
  @ApiOkResponse({ type: RaceDto, description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing authentication token', type: ErrorDto })
  @ApiNotFoundResponse({ description: 'Race or trait not found', type: ErrorDto })
  async removeSkillBonus(
    @Param('id') id: string,
    @Param('skillId') skillId: string,
    @Query('specialization') specialization: string | null,
    @Request() req,
  ) {
    const userId = req.user! as string;
    const roles = req.user!.roles as string[];
    const command = new DeleteRaceSkillBonusCommand(id, skillId, specialization, userId, roles);
    const entity = await this.commandBus.execute<DeleteRaceSkillBonusCommand, Race>(command);
    return RaceDto.fromEntity(entity);
  }
}
