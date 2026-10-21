import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../shared/infrastructure/security/jwt-auth.guard.js';
import { CultureDto, CulturePageDto } from './dto/culture.dto.js';
import { CreateCultureDto } from './dto/create-culture.dto.js';
import { GetCultureQuery } from '../../application/cqrs/queries/get-culture.query.js';
import { GetCulturesQuery } from '../../application/cqrs/queries/get-cultures.query.js';
import { UpdateCultureDto } from './dto/update-culture.dto.js';
import { Page } from '../../../shared/domain/entities/page.js';
import { ErrorDto } from '../../../shared/interfaces/http/dto/error-dto.js';
import { PagedQueryDto } from '../../../shared/interfaces/http/dto/paged-rsql-query.js';
import { CreateCultureCommand } from '../../application/cqrs/commands/create-culture.command.js';
import { UpdateCultureCommand } from '../../application/cqrs/commands/update-culture.command.js';
import { DeleteCultureCommand } from '../../application/cqrs/commands/delete-culture.command.js';
import { AddCultureSkillRankDto } from './dto/add-culture-skill-rank.dto.js';
import { AddCultureSkillRankCommand } from '../../application/cqrs/commands/add-culture-skill-rank.command.js';
import { DeleteCultureSkillRankCommand } from '../../application/cqrs/commands/delete-culture-skill-rank.command.js';
import type { CultureView } from '../../application/read-models/culture-view.js';
import type { AuthenticatedRequest } from '../../../shared/interfaces/http/authenticated-request.js';

@UseGuards(JwtAuthGuard)
@Controller('v1/cultures')
@ApiTags('Cultures')
export class CultureController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get(':id')
  @ApiOperation({ operationId: 'findCultureById', summary: 'Find culture by id' })
  @ApiOkResponse({ type: CultureDto })
  @ApiNotFoundResponse({ description: 'Culture not found', type: ErrorDto })
  async findById(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    const userId: string = req.user.id;
    const roles: string[] = req.user.roles;
    const query = new GetCultureQuery(id, userId, roles);
    const view = await this.queryBus.execute<GetCultureQuery, CultureView>(query);
    return CultureDto.fromView(view);
  }

  @Get('')
  @ApiOperation({ operationId: 'findCultures', summary: 'Find cultures by RSQL' })
  @ApiOkResponse({ type: CulturePageDto })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing authentication token', type: ErrorDto })
  @ApiResponse({ status: 400, description: 'Invalid RSQL query', type: ErrorDto })
  async find(@Query() dto: PagedQueryDto, @Request() req: AuthenticatedRequest) {
    const userId: string = req.user.id;
    const roles: string[] = req.user.roles;
    const query = new GetCulturesQuery(dto.q, dto.page, dto.size, userId, roles);
    const page = await this.queryBus.execute<GetCulturesQuery, Page<CultureView>>(query);
    const mapped = page.content.map(view => CultureDto.fromView(view));
    return new Page<CultureDto>(mapped, page.pagination.page, page.pagination.size, page.pagination.totalElements);
  }

  @Post('')
  @ApiOperation({ operationId: 'createCulture', summary: 'Create a new culture' })
  @ApiOkResponse({ type: CultureDto, description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing authentication token', type: ErrorDto })
  @ApiResponse({ status: 400, description: 'Bad request, invalid data', type: ErrorDto })
  @ApiResponse({ status: 409, description: 'Conflict, culture already exists', type: ErrorDto })
  async create(@Body() createCultureDto: CreateCultureDto, @Request() req: AuthenticatedRequest) {
    const userId: string = req.user.id;
    const roles: string[] = req.user.roles;
    const command = CreateCultureDto.toCommand(createCultureDto, userId, roles);
    const view = await this.commandBus.execute<CreateCultureCommand, CultureView>(command);
    return CultureDto.fromView(view);
  }

  @Patch(':id')
  @ApiOperation({ operationId: 'updateCulture', summary: 'Update culture by id' })
  @ApiOkResponse({ type: CultureDto, description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing authentication token', type: ErrorDto })
  @ApiNotFoundResponse({ description: 'Culture not found', type: ErrorDto })
  @ApiResponse({ status: 400, description: 'Bad request, invalid data', type: ErrorDto })
  async updateSettings(@Param('id') id: string, @Body() dto: UpdateCultureDto, @Request() req: AuthenticatedRequest) {
    const userId: string = req.user.id;
    const roles: string[] = req.user.roles;
    const command = UpdateCultureDto.toCommand(id, dto, userId, roles);
    const view = await this.commandBus.execute<UpdateCultureCommand, CultureView>(command);
    return CultureDto.fromView(view);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ operationId: 'deleteCulture', summary: 'Delete culture by id' })
  @ApiNotFoundResponse({ description: 'Culture not found', type: ErrorDto })
  async delete(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    const userId: string = req.user.id;
    const roles: string[] = req.user.roles;
    const command = new DeleteCultureCommand(id, userId, roles);
    await this.commandBus.execute(command);
  }

  @Post(':id/skill-ranks')
  @HttpCode(200)
  @ApiOperation({ operationId: 'addCultureSkillRank', summary: 'Append a ranks entry to the culture' })
  @ApiOkResponse({ type: CultureDto, description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing authentication token', type: ErrorDto })
  @ApiNotFoundResponse({ description: 'Culture not found', type: ErrorDto })
  @ApiResponse({ status: 400, description: 'Bad request, invalid data', type: ErrorDto })
  async addSkillRank(@Param('id') id: string, @Body() dto: AddCultureSkillRankDto, @Request() req: AuthenticatedRequest) {
    const userId: string = req.user.id;
    const roles: string[] = req.user.roles;
    const command = AddCultureSkillRankDto.toCommand(id, dto, userId, roles);
    const view = await this.commandBus.execute<AddCultureSkillRankCommand, CultureView>(command);
    return CultureDto.fromView(view);
  }

  @Delete(':id/skill-ranks/:index')
  @HttpCode(200)
  @ApiOperation({ operationId: 'deleteCultureSkillRank', summary: 'Delete the culture ranks entry at a position' })
  @ApiParam({ name: 'index', description: 'Zero-based position of the entry in skillRanks', type: Number })
  @ApiOkResponse({ type: CultureDto, description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing authentication token', type: ErrorDto })
  @ApiNotFoundResponse({ description: 'Culture or entry not found', type: ErrorDto })
  async deleteSkillRank(@Param('id') id: string, @Param('index', ParseIntPipe) index: number, @Request() req: AuthenticatedRequest) {
    const userId: string = req.user.id;
    const roles: string[] = req.user.roles;
    const command = new DeleteCultureSkillRankCommand(id, index, userId, roles);
    const view = await this.commandBus.execute<DeleteCultureSkillRankCommand, CultureView>(command);
    return CultureDto.fromView(view);
  }
}
