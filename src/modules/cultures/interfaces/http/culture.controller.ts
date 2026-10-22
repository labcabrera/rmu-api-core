import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../shared/infrastructure/security/jwt-auth.guard.js';
import { CultureDto, CulturePageDto } from './dto/culture.dto.js';
import { CreateCultureDto } from './dto/create-culture.dto.js';
import { GetCultureQuery } from '../../application/cqrs/queries/get-culture.query.js';
import { GetCulturesQuery } from '../../application/cqrs/queries/get-cultures.query.js';
import { UpdateCultureDto } from './dto/update-culture.dto.js';
import { Page } from '../../../shared/application/pagination/page.js';
import { PagedQueryDto } from '../../../shared/interfaces/http/dto/paged-rsql-query.js';
import { CreateCultureCommand } from '../../application/cqrs/commands/create-culture.command.js';
import { UpdateCultureCommand } from '../../application/cqrs/commands/update-culture.command.js';
import { DeleteCultureCommand } from '../../application/cqrs/commands/delete-culture.command.js';
import { AddCultureSkillRankDto } from './dto/add-culture-skill-rank.dto.js';
import { AddCultureSkillRankCommand } from '../../application/cqrs/commands/add-culture-skill-rank.command.js';
import { DeleteCultureSkillRankCommand } from '../../application/cqrs/commands/delete-culture-skill-rank.command.js';
import type { CultureView } from '../../application/read-models/culture-view.js';
import type { AuthenticatedUser } from '../../../shared/interfaces/http/authenticated-request.js';
import { CurrentUser } from '../../../shared/interfaces/http/current-user.decorator.js';
import { ApiErrors } from '../../../shared/interfaces/http/api-errors.decorator.js';

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
  @ApiErrors({ 404: 'Culture not found' })
  async findById(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    const userId: string = user.id;
    const roles: string[] = user.roles;
    const query = new GetCultureQuery(id, userId, roles);
    const view = await this.queryBus.execute<GetCultureQuery, CultureView>(query);
    return CultureDto.fromView(view);
  }

  @Get('')
  @ApiOperation({ operationId: 'findCultures', summary: 'Find cultures by RSQL' })
  @ApiOkResponse({ type: CulturePageDto })
  @ApiErrors({ 400: 'Invalid RSQL query' })
  async find(@Query() dto: PagedQueryDto, @CurrentUser() user: AuthenticatedUser) {
    const userId: string = user.id;
    const roles: string[] = user.roles;
    const query = new GetCulturesQuery(dto.q, dto.page, dto.size, userId, roles);
    const page = await this.queryBus.execute<GetCulturesQuery, Page<CultureView>>(query);
    const mapped = page.content.map(view => CultureDto.fromView(view));
    return new Page<CultureDto>(mapped, page.pagination.page, page.pagination.size, page.pagination.totalElements);
  }

  @Post('')
  @ApiOperation({ operationId: 'createCulture', summary: 'Create a new culture' })
  @ApiOkResponse({ type: CultureDto, description: 'Success' })
  @ApiErrors({ 400: 'Bad request, invalid data', 409: 'Conflict, culture already exists' })
  async create(@Body() createCultureDto: CreateCultureDto, @CurrentUser() user: AuthenticatedUser) {
    const userId: string = user.id;
    const roles: string[] = user.roles;
    const command = CreateCultureDto.toCommand(createCultureDto, userId, roles);
    const view = await this.commandBus.execute<CreateCultureCommand, CultureView>(command);
    return CultureDto.fromView(view);
  }

  @Patch(':id')
  @ApiOperation({ operationId: 'updateCulture', summary: 'Update culture by id' })
  @ApiOkResponse({ type: CultureDto, description: 'Success' })
  @ApiErrors({ 400: 'Bad request, invalid data', 404: 'Culture not found' })
  async updateSettings(@Param('id') id: string, @Body() dto: UpdateCultureDto, @CurrentUser() user: AuthenticatedUser) {
    const userId: string = user.id;
    const roles: string[] = user.roles;
    const command = UpdateCultureDto.toCommand(id, dto, userId, roles);
    const view = await this.commandBus.execute<UpdateCultureCommand, CultureView>(command);
    return CultureDto.fromView(view);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ operationId: 'deleteCulture', summary: 'Delete culture by id' })
  @ApiErrors({ 404: 'Culture not found' })
  async delete(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    const userId: string = user.id;
    const roles: string[] = user.roles;
    const command = new DeleteCultureCommand(id, userId, roles);
    await this.commandBus.execute(command);
  }

  @Post(':id/skill-ranks')
  @HttpCode(200)
  @ApiOperation({ operationId: 'addCultureSkillRank', summary: 'Append a ranks entry to the culture' })
  @ApiOkResponse({ type: CultureDto, description: 'Success' })
  @ApiErrors({ 400: 'Bad request, invalid data', 404: 'Culture not found' })
  async addSkillRank(@Param('id') id: string, @Body() dto: AddCultureSkillRankDto, @CurrentUser() user: AuthenticatedUser) {
    const userId: string = user.id;
    const roles: string[] = user.roles;
    const command = AddCultureSkillRankDto.toCommand(id, dto, userId, roles);
    const view = await this.commandBus.execute<AddCultureSkillRankCommand, CultureView>(command);
    return CultureDto.fromView(view);
  }

  @Delete(':id/skill-ranks/:index')
  @HttpCode(200)
  @ApiOperation({ operationId: 'deleteCultureSkillRank', summary: 'Delete the culture ranks entry at a position' })
  @ApiParam({ name: 'index', description: 'Zero-based position of the entry in skillRanks', type: Number })
  @ApiOkResponse({ type: CultureDto, description: 'Success' })
  @ApiErrors({ 404: 'Culture or entry not found' })
  async deleteSkillRank(@Param('id') id: string, @Param('index', ParseIntPipe) index: number, @CurrentUser() user: AuthenticatedUser) {
    const userId: string = user.id;
    const roles: string[] = user.roles;
    const command = new DeleteCultureSkillRankCommand(id, index, userId, roles);
    const view = await this.commandBus.execute<DeleteCultureSkillRankCommand, CultureView>(command);
    return CultureDto.fromView(view);
  }
}
