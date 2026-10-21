/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Get, Param, UseGuards, Request, Query, Post, Body } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../shared/infrastructure/security/jwt-auth.guard.js';
import { Page } from '../../../shared/domain/entities/page.js';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetSkillCategoryQuery } from '../../application/cqrs/queries/get-skill-category.query.js';
import { PagedQueryDto } from '../../../shared/interfaces/http/dto/paged-rsql-query.js';
import { GetSkillCategoriesQuery } from '../../application/cqrs/queries/get-skill-categories.query.js';
import { ErrorDto } from '../../../shared/interfaces/http/dto/error-dto.js';
import { NotFoundError } from '../../../shared/domain/errors/errors.js';
import { SkillCategoryDto, SkillCategoryPageDto } from './dto/skill-category.dto.js';
import { CreateSkillCategoryDto } from './dto/create-skill-category.dto.js';
import { SkillCategory } from '../../domain/entities/skill-category.js';

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
  @ApiNotFoundResponse({ description: 'Skill category not found', type: ErrorDto })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing authentication token', type: ErrorDto })
  async findById(@Param('id') id: string, @Request() req) {
    const userId: string = req.user!.id as string;
    const query = new GetSkillCategoryQuery(id, userId);
    const entity = await this.queryBus.execute<GetSkillCategoryQuery, SkillCategory>(query);
    if (!entity) throw new NotFoundError('SkillCategory', id);
    return SkillCategoryDto.fromEntity(entity);
  }

  @Get('')
  @ApiOperation({ operationId: 'findSkillCategories', summary: 'Find skill categories by RSQL' })
  @ApiOkResponse({ type: SkillCategoryPageDto })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing authentication token', type: ErrorDto })
  @ApiResponse({ status: 400, description: 'Invalid RSQL query', type: ErrorDto })
  async find(@Query() dto: PagedQueryDto, @Request() req) {
    const userId: string = req.user!.id as string;
    const query = new GetSkillCategoriesQuery(dto.q, dto.page, dto.size, userId);
    const page = await this.queryBus.execute<GetSkillCategoriesQuery, Page<SkillCategory>>(query);
    const mapped = page.content.map(category => SkillCategoryDto.fromEntity(category));
    return new Page<SkillCategoryDto>(mapped, page.pagination.page, page.pagination.size, page.pagination.totalElements);
  }

  @Post('')
  @ApiOperation({ operationId: 'createSkillCategory', summary: 'Create a new skill category' })
  @ApiOkResponse({ type: SkillCategoryDto, description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing authentication token', type: ErrorDto })
  @ApiResponse({ status: 400, description: 'Bad request, invalid data', type: ErrorDto })
  @ApiResponse({ status: 409, description: 'Conflict, skill category already exists', type: ErrorDto })
  async create(@Body() createSkillCategoryDto: CreateSkillCategoryDto, @Request() req) {
    const userId: string = req.user!.id as string;
    const roles: string[] = req.user!.roles as string[];
    const command = CreateSkillCategoryDto.toCommand(createSkillCategoryDto, userId, roles);
    const entity = await this.commandBus.execute<CreateSkillCategoryDto, SkillCategory>(command);
    return SkillCategoryDto.fromEntity(entity);
  }
}
