/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt.auth.guard';
import { CultureDto, CulturePageDto } from './dtos/culture.dto';
import { CreateCultureDto } from './dtos/create-culture.dto';
import { GetCultureQuery } from '../../application/cqrs/queries/get-culture.query';
import { GetCulturesQuery } from '../../application/cqrs/queries/get-cultures.query';
import { UpdateCultureDto } from './dtos/update-culture.dto';
import { Page } from 'src/modules/shared/domain/entities/page';
import { ErrorDto } from 'src/modules/shared/interfaces/http/dto/error-dto';
import { PagedQueryDto } from 'src/modules/shared/interfaces/http/dto/paged-rsql-query';
import { CreateCultureCommand } from '../../application/cqrs/commands/create-culture.command';
import { UpdateCultureCommand } from '../../application/cqrs/commands/update-culture.command';
import { DeleteCultureCommand } from '../../application/cqrs/commands/delete-culture.command';
import { AddCultureSkillRankDto } from './dtos/add-culture-skill-rank.dto';
import { AddCultureSkillRankCommand } from '../../application/cqrs/commands/add-culture-skill-rank.command';
import { DeleteCultureSkillRankCommand } from '../../application/cqrs/commands/delete-culture-skill-rank.command';
import { CultureView } from '../../application/read-models/culture-view';

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
  async findById(@Param('id') id: string, @Request() req) {
    const userId: string = req.user!.id as string;
    const roles: string[] = req.user!.roles as string[];
    const query = new GetCultureQuery(id, userId, roles);
    const view = await this.queryBus.execute<GetCultureQuery, CultureView>(query);
    return CultureDto.fromView(view);
  }

  @Get('')
  @ApiOperation({ operationId: 'findCultures', summary: 'Find cultures by RSQL' })
  @ApiOkResponse({ type: CulturePageDto })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing authentication token', type: ErrorDto })
  @ApiResponse({ status: 400, description: 'Invalid RSQL query', type: ErrorDto })
  async find(@Query() dto: PagedQueryDto, @Request() req) {
    const userId: string = req.user!.id as string;
    const roles: string[] = req.user!.roles as string[];
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
  async create(@Body() createCultureDto: CreateCultureDto, @Request() req) {
    const userId: string = req.user!.id as string;
    const roles: string[] = req.user!.roles as string[];
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
  async updateSettings(@Param('id') id: string, @Body() dto: UpdateCultureDto, @Request() req) {
    const userId: string = req.user!.id as string;
    const roles: string[] = req.user!.roles as string[];
    const command = UpdateCultureDto.toCommand(id, dto, userId, roles);
    const view = await this.commandBus.execute<UpdateCultureCommand, CultureView>(command);
    return CultureDto.fromView(view);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ operationId: 'deleteCulture', summary: 'Delete culture by id' })
  @ApiNotFoundResponse({ description: 'Culture not found', type: ErrorDto })
  async delete(@Param('id') id: string, @Request() req) {
    const userId: string = req.user!.id as string;
    const roles: string[] = req.user!.roles as string[];
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
  async addSkillRank(@Param('id') id: string, @Body() dto: AddCultureSkillRankDto, @Request() req) {
    const userId: string = req.user!.id as string;
    const roles: string[] = req.user!.roles as string[];
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
  async deleteSkillRank(@Param('id') id: string, @Param('index', ParseIntPipe) index: number, @Request() req) {
    const userId: string = req.user!.id as string;
    const roles: string[] = req.user!.roles as string[];
    const command = new DeleteCultureSkillRankCommand(id, index, userId, roles);
    const view = await this.commandBus.execute<DeleteCultureSkillRankCommand, CultureView>(command);
    return CultureDto.fromView(view);
  }
}
