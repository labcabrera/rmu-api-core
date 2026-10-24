import { Controller, Get, Param, Query, UseGuards, Post, Body, Patch, HttpCode, Delete } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../shared/infrastructure/security/jwt-auth.guard.js';
import { SkillDto, SkillPageDto } from './dto/skill.dto.js';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateSkillDto } from './dto/create-skill.dto.js';
import { CatalogPagedQueryDto } from '../../../shared/interfaces/http/dto/paged-rsql-query.js';
import { GetSkillQuery } from '../../application/cqrs/queries/get-skill.query.js';
import { GetSkillsQuery } from '../../application/cqrs/queries/get-skills.query.js';
import { Page } from '../../../shared/application/pagination/page.js';
import type { SkillView } from '../../application/read-models/skill-view.js';
import { UpdateSkillDto } from './dto/update-skill.dto.js';
import { DeleteSkillCommand } from '../../application/cqrs/commands/delete-skill.command.js';
import { UpdateSkillCommand } from '../../application/cqrs/commands/update-skill.command.js';
import { CreateSkillCommand } from '../../application/cqrs/commands/create-skill.command.js';
import type { AuthenticatedUser } from '../../../shared/interfaces/http/authenticated-request.js';
import { CurrentUser } from '../../../shared/interfaces/http/current-user.decorator.js';
import { ApiErrors } from '../../../shared/interfaces/http/api-errors.decorator.js';

@UseGuards(JwtAuthGuard)
@Controller('v1/skills')
@ApiTags('Skills')
export class SkillController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get(':id')
  @ApiOperation({ operationId: 'findSkillById', summary: 'Find skill by id' })
  @ApiOkResponse({ type: SkillDto, description: 'Success' })
  @ApiErrors({ 404: 'Skill not found' })
  async findById(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    const userId: string = user.id;
    const roles: string[] = user.roles;
    const query = new GetSkillQuery(id, userId, roles);
    const entity = await this.queryBus.execute<GetSkillQuery, SkillView>(query);
    return SkillDto.fromView(entity);
  }

  @Get('')
  @ApiOperation({ operationId: 'findSkills', summary: 'Find skills by RSQL' })
  @ApiOkResponse({ type: SkillPageDto, description: 'Success' })
  @ApiErrors({ 400: 'Invalid RSQL query' })
  async find(@Query() dto: CatalogPagedQueryDto, @CurrentUser() user: AuthenticatedUser): Promise<SkillPageDto> {
    const userId: string = user.id;
    const roles: string[] = user.roles;
    const query = new GetSkillsQuery(dto.q, dto.page, dto.size, userId, roles);
    const page = await this.queryBus.execute<GetSkillsQuery, Page<SkillView>>(query);
    const mapped = page.content.map(view => SkillDto.fromView(view));
    return new Page<SkillDto>(mapped, page.pagination.page, page.pagination.size, page.pagination.totalElements);
  }

  @Post('')
  @HttpCode(201)
  @ApiBody({ type: CreateSkillDto })
  @ApiOperation({ operationId: 'createSkill', summary: 'Create skill' })
  @ApiOkResponse({ type: SkillDto, description: 'Success' })
  @ApiErrors({ 400: 'Bad request, invalid data', 409: 'Conflict, skill already exists' })
  async create(@Body() createSkillDto: CreateSkillDto, @CurrentUser() user: AuthenticatedUser) {
    const userId: string = user.id;
    const roles: string[] = user.roles;
    const command = CreateSkillDto.toCommand(createSkillDto, userId, roles);
    const entity = await this.commandBus.execute<CreateSkillCommand, SkillView>(command);
    return SkillDto.fromView(entity);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateSkillDto })
  @ApiOperation({ operationId: 'updateSkill', summary: 'Update skill' })
  @ApiOkResponse({ type: SkillDto, description: 'Success' })
  @ApiErrors({ 400: 'Bad request, invalid data', 404: 'Skill not found' })
  async update(@Param('id') id: string, @Body() dto: UpdateSkillDto, @CurrentUser() user: AuthenticatedUser) {
    const userId: string = user.id;
    const roles: string[] = user.roles;
    const command = UpdateSkillDto.toCommand(id, dto, userId, roles);
    const entity = await this.commandBus.execute<UpdateSkillCommand, SkillView>(command);
    return SkillDto.fromView(entity);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ operationId: 'deleteSkill', summary: 'Delete skill' })
  @ApiOkResponse({ type: SkillDto, description: 'Success' })
  @ApiErrors({ 404: 'Skill not found' })
  async delete(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    const userId: string = user.id;
    const roles: string[] = user.roles;
    const command = new DeleteSkillCommand(id, userId, roles);
    await this.commandBus.execute(command);
  }
}
