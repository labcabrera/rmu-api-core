/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Get, Param, Query, UseGuards, Post, Body, Request } from '@nestjs/common';
import { ApiBody, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt.auth.guard';
import { SkillDto, SkillPageDto } from './dto/skill.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateSkillDto } from './dto/create-skill.dto';
import { PagedQueryDto } from 'src/modules/shared/interfaces/http/dto/paged-rsql-query';
import { GetSkillQuery } from '../../application/cqrs/queries/get-skill.query';
import { GetSkillsQuery } from '../../application/cqrs/queries/get-skills.query';
import { Page } from 'src/modules/shared/domain/entities/page';
import { Skill } from '../../domain/aggregates/skill';
import { NotFoundError } from 'src/modules/shared/domain/errors/errors';
import { ErrorDto } from 'src/modules/shared/interfaces/http/dto/error-dto';

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
  @ApiUnauthorizedResponse({ description: 'Invalid or missing authentication token', type: ErrorDto })
  @ApiNotFoundResponse({ description: 'Realm not found', type: ErrorDto })
  async findById(@Param('id') id: string, @Request() req) {
    const userId: string = req.user!.id as string;
    const roles: string[] = req.user!.roles as string[];
    const query = new GetSkillQuery(id, userId, roles);
    const entity = await this.queryBus.execute<GetSkillQuery, Skill>(query);
    if (!entity) throw new NotFoundError('Skill not found', id);
    return SkillDto.fromEntity(entity);
  }

  @Get('')
  @ApiOperation({ operationId: 'findSkills', summary: 'Find skills by RSQL' })
  @ApiOkResponse({ type: SkillPageDto, description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing authentication token', type: ErrorDto })
  @ApiResponse({ status: 400, description: 'Invalid RSQL query', type: ErrorDto })
  async find(@Query() dto: PagedQueryDto, @Request() req): Promise<SkillPageDto> {
    const userId: string = req.user!.id as string;
    const roles: string[] = req.user!.roles as string[];
    const query = new GetSkillsQuery(dto.q, dto.page, dto.size, userId, roles);
    const page = await this.queryBus.execute<GetSkillsQuery, Page<Skill>>(query);
    const mapped = page.content.map((category) => SkillDto.fromEntity(category));
    return new Page<SkillDto>(mapped, page.pagination.page, page.pagination.size, page.pagination.totalElements);
  }

  @Post('')
  @ApiBody({ type: CreateSkillDto })
  @ApiOperation({ operationId: 'findSkills', summary: 'Find skills by RSQL' })
  @ApiOkResponse({ type: SkillDto, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Bad request, invalid data', type: ErrorDto })
  @ApiResponse({ status: 409, description: 'Conflict, skill already exists', type: ErrorDto })
  create(@Body() createSkillDto: CreateSkillDto, @Request() req) {
    const userId: string = req.user!.id as string;
    const roles: string[] = req.user!.roles as string[];
    const command = CreateSkillDto.toCommand(createSkillDto, userId, roles);
    return this.commandBus.execute(command);
  }
}
