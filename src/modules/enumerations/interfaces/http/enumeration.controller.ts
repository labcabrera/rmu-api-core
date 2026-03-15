import { Controller, Get, Param, Query, UseGuards, Post, Body, Request } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt.auth.guard';
import { EnumerationDto, EnumerationPageDto } from './dto/enumeration.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateEnumerationDto } from './dto/create-enumeration.dto';
import { PagedQueryDto } from 'src/modules/shared/interfaces/http/dto/paged-rsql-query';
import { GetEnumerationQuery } from '../../application/cqrs/queries/get-enumeration.query';
import { GetEnumerationsQuery } from '../../application/cqrs/queries/get-enumerations.query';
import { Page } from 'src/modules/shared/domain/entities/page';
import { Enumeration } from '../../domain/aggregates/enumeration';
import { NotFoundError } from 'src/modules/shared/domain/errors/errors';

@UseGuards(JwtAuthGuard)
@Controller('v1/enumerations')
@ApiTags('Enumerations')
export class EnumerationController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get(':id')
  @ApiOperation({ operationId: 'findSkillById', summary: 'Find skill by id' })
  @ApiOkResponse({ type: EnumerationDto })
  async findById(@Param('id') id: string, @Request() req) {
    const userId: string = req.user!.id as string;
    const roles: string[] = req.user!.roles as string[];
    const query = new GetEnumerationQuery(id, userId, roles);
    const entity = await this.queryBus.execute<GetEnumerationQuery, Enumeration>(query);
    if (!entity) throw new NotFoundError('Skill not found', id);
    return EnumerationDto.fromEntity(entity);
  }

  @Get('')
  @ApiOperation({ operationId: 'findAllSkills', summary: 'Find all skills' })
  @ApiOkResponse({ type: EnumerationPageDto })
  async find(@Query() dto: PagedQueryDto, @Request() req): Promise<EnumerationPageDto> {
    const userId: string = req.user!.id as string;
    const roles: string[] = req.user!.roles as string[];
    const query = new GetEnumerationsQuery(dto.q, dto.page, dto.size, userId, roles);
    const page = await this.queryBus.execute<GetEnumerationsQuery, Page<Enumeration>>(query);
    const mapped = page.content.map((category) => EnumerationDto.fromEntity(category));
    return new Page<EnumerationDto>(mapped, page.pagination.page, page.pagination.size, page.pagination.totalElements);
  }

  @Post('')
  create(@Body() createSkillDto: CreateEnumerationDto, @Request() req) {
    const userId: string = req.user!.id as string;
    const roles: string[] = req.user!.roles as string[];
    const command = CreateEnumerationDto.toCommand(createSkillDto, userId, roles);
    return this.commandBus.execute(command);
  }
}
