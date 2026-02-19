import { Controller, Get, Param, Query, UseGuards, Post, Body, Request } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
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
  @ApiOkResponse({ type: SkillDto })
  async findById(@Param('id') id: string, @Request() req) {
    const userId: string = req.user!.id as string;
    const query = new GetSkillQuery(id, userId);
    const entity = await this.queryBus.execute<GetSkillQuery, Skill>(query);
    if (!entity) throw new NotFoundError('Skill not found', id);
    return SkillDto.fromEntity(entity);
  }

  @Get('')
  @ApiOperation({ operationId: 'findAllSkills', summary: 'Find all skills' })
  @ApiOkResponse({ type: SkillPageDto })
  async find(@Query() dto: PagedQueryDto, @Request() req): Promise<SkillPageDto> {
    const userId: string = req.user!.id as string;
    const query = new GetSkillsQuery(dto.q, dto.page, dto.size, userId);
    const page = await this.queryBus.execute<GetSkillsQuery, Page<Skill>>(query);
    const mapped = page.content.map((category) => SkillDto.fromEntity(category));
    return new Page<SkillDto>(mapped, page.pagination.page, page.pagination.size, page.pagination.totalElements);
  }

  @Post('')
  create(@Body() createSkillDto: CreateSkillDto, @Request() req) {
    const userId: string = req.user!.id as string;
    const roles: string[] = req.user!.roles as string[];
    const command = CreateSkillDto.toCommand(createSkillDto, userId, roles);
    return this.commandBus.execute(command);
  }
}
