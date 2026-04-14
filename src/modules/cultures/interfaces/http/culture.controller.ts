/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt.auth.guard';
import { Culture } from '../../domain/aggregates/culture';
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
import { CultureSkillRankDto } from './dtos/culture-skill-rank.dto';
import { AddCultureFixedSkillRankCommand } from '../../application/cqrs/commands/add-culture-fixed-skill-rank.command';
import { DeleteCultureFixedSkillRankCommand } from '../../application/cqrs/commands/delete-culture-fixed-skill-rank.command';

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
    const entity = await this.queryBus.execute<GetCultureQuery, Culture>(query);
    return CultureDto.fromEntity(entity);
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
    const page = await this.queryBus.execute<GetCulturesQuery, Page<Culture>>(query);
    const mapped = page.content.map(culture => CultureDto.fromEntity(culture));
    return new Page<CultureDto>(mapped, page.pagination.page, page.pagination.size, page.pagination.totalElements);
  }

  @Post('')
  @ApiOperation({ operationId: 'createCulture', summary: 'Create a new culture' })
  @ApiOkResponse({ type: CultureDto, description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing authentication token', type: ErrorDto })
  @ApiResponse({ status: 400, description: 'Bad request, invalid data', type: ErrorDto })
  @ApiResponse({ status: 409, description: 'Conflict, culture already exists', type: ErrorDto })
  async create(@Body() createRaceDto: CreateCultureDto, @Request() req) {
    const userId: string = req.user!.id as string;
    const roles: string[] = req.user!.roles as string[];
    const command = CreateCultureDto.toCommand(createRaceDto, userId, roles);
    const entity = await this.commandBus.execute<CreateCultureCommand, Culture>(command);
    return CultureDto.fromEntity(entity);
  }

  @Patch(':id')
  @ApiOperation({ operationId: 'updateCulture', summary: 'Update culture by id' })
  @ApiOkResponse({ type: CultureDto, description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing authentication token', type: ErrorDto })
  @ApiNotFoundResponse({ description: 'Race not found', type: ErrorDto })
  @ApiResponse({ status: 400, description: 'Bad request, invalid data', type: ErrorDto })
  async updateSettings(@Param('id') id: string, @Body() dto: UpdateCultureDto, @Request() req) {
    const userId = req.user! as string;
    const roles = req.user!.roles as string[];
    const command = UpdateCultureDto.toCommand(id, dto, userId, roles);
    const entity = this.commandBus.execute<UpdateCultureCommand, Culture>(command);
    return CultureDto.fromEntity(await entity);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ operationId: 'deleteCulture', summary: 'Delete culture by id' })
  @ApiNotFoundResponse({ description: 'Culture not found', type: ErrorDto })
  async delete(@Param('id') id: string, @Request() req) {
    const userId = req.user! as string;
    const roles = req.user!.roles as string[];
    const command = new DeleteCultureCommand(id, userId, roles);
    await this.commandBus.execute(command);
  }

  @Post(':id/fixed-skills')
  @HttpCode(200)
  @ApiOperation({ operationId: 'addCultureFixedSkill', summary: 'Add culture fixed skill ranks' })
  @ApiOkResponse({ type: CultureDto, description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing authentication token', type: ErrorDto })
  @ApiResponse({ status: 400, description: 'Bad request, invalid data', type: ErrorDto })
  async addFixedSkill(@Param('id') id: string, @Body() dto: CultureSkillRankDto, @Request() req) {
    const userId: string = req.user!.id as string;
    const roles: string[] = req.user!.roles as string[];
    const command = new AddCultureFixedSkillRankCommand(id, dto.skillId, dto.specialization, dto.ranks, userId, roles);
    const entity = await this.commandBus.execute<AddCultureFixedSkillRankCommand, Culture>(command);
    return CultureDto.fromEntity(entity);
  }

  @Delete(':id/fixed-skills/:skillId')
  @HttpCode(200)
  @ApiOperation({ operationId: 'deleteCultureFixedSkill', summary: 'Delete culture fixed skill ranks' })
  @ApiOkResponse({ type: CultureDto, description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing authentication token', type: ErrorDto })
  @ApiResponse({ status: 400, description: 'Bad request, invalid data', type: ErrorDto })
  async deleteFixedSkill(
    @Param('id') id: string,
    @Param('skillId') skillId: string,
    @Query('specialization') specialization: string | null,
    @Request() req,
  ) {
    const userId: string = req.user!.id as string;
    const roles: string[] = req.user!.roles as string[];
    const command = new DeleteCultureFixedSkillRankCommand(id, skillId, specialization, userId, roles);
    const entity = await this.commandBus.execute<DeleteCultureFixedSkillRankCommand, Culture>(command);
    return CultureDto.fromEntity(entity);
  }
}
