import { Controller, Get, Param, UseGuards, Query, Post, Body } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../shared/infrastructure/security/jwt-auth.guard.js';
import { Page } from '../../../shared/application/pagination/page.js';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetSkillCategoryQuery } from '../../application/cqrs/queries/get-skill-category.query.js';
import { CatalogPagedQueryDto } from '../../../shared/interfaces/http/dto/paged-rsql-query.js';
import { GetSkillCategoriesQuery } from '../../application/cqrs/queries/get-skill-categories.query.js';
import { NotFoundError } from '../../../shared/domain/errors/errors.js';
import { SkillCategoryDto, SkillCategoryPageDto } from './dto/skill-category.dto.js';
import { CreateSkillCategoryDto } from './dto/create-skill-category.dto.js';
import { SkillCategory } from '../../domain/entities/skill-category.js';
import type { AuthenticatedUser } from '../../../shared/interfaces/http/authenticated-request.js';
import { CurrentUser } from '../../../shared/interfaces/http/current-user.decorator.js';
import { ApiErrors } from '../../../shared/interfaces/http/api-errors.decorator.js';

@UseGuards(JwtAuthGuard)
@Controller('v1/skill-categories')
@ApiTags('Skill Categories')
export class SkillCategoryController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get(':id')
  @ApiOkResponse({ type: SkillCategoryDto })
  @ApiOperation({ operationId: 'findSkillCategory', summary: 'Find skill category by id' })
  @ApiErrors({ 404: 'Skill category not found' })
  async findById(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    const userId: string = user.id;
    const query = new GetSkillCategoryQuery(id, userId);
    const entity = await this.queryBus.execute<GetSkillCategoryQuery, SkillCategory>(query);
    if (!entity) throw new NotFoundError('SkillCategory', id);
    return SkillCategoryDto.fromEntity(entity);
  }

  @Get('')
  @ApiOperation({ operationId: 'findSkillCategories', summary: 'Find skill categories by RSQL' })
  @ApiOkResponse({ type: SkillCategoryPageDto })
  @ApiErrors({ 400: 'Invalid RSQL query' })
  async find(@Query() dto: CatalogPagedQueryDto, @CurrentUser() user: AuthenticatedUser) {
    const userId: string = user.id;
    const query = new GetSkillCategoriesQuery(dto.q, dto.page, dto.size, userId);
    const page = await this.queryBus.execute<GetSkillCategoriesQuery, Page<SkillCategory>>(query);
    const mapped = page.content.map(category => SkillCategoryDto.fromEntity(category));
    return new Page<SkillCategoryDto>(mapped, page.pagination.page, page.pagination.size, page.pagination.totalElements);
  }

  @Post('')
  @ApiOperation({ operationId: 'createSkillCategory', summary: 'Create a new skill category' })
  @ApiOkResponse({ type: SkillCategoryDto, description: 'Success' })
  @ApiErrors({
    400: 'Bad request, invalid data',
    403: 'Only an admin creates skill categories',
    409: 'Conflict, skill category already exists',
  })
  async create(@Body() createSkillCategoryDto: CreateSkillCategoryDto, @CurrentUser() user: AuthenticatedUser) {
    const userId: string = user.id;
    const roles: string[] = user.roles;
    const command = CreateSkillCategoryDto.toCommand(createSkillCategoryDto, userId, roles);
    const entity = await this.commandBus.execute<CreateSkillCategoryDto, SkillCategory>(command);
    return SkillCategoryDto.fromEntity(entity);
  }
}
