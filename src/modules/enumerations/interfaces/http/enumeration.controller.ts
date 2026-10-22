import { Controller, Get, Param, Query, UseGuards, Post, Body, Delete, HttpCode, Patch } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../shared/infrastructure/security/jwt-auth.guard.js';
import { EnumerationDto, EnumerationPageDto } from './dto/enumeration.dto.js';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateEnumerationDto } from './dto/create-enumeration.dto.js';
import { PagedQueryDto } from '../../../shared/interfaces/http/dto/paged-rsql-query.js';
import { GetEnumerationQuery } from '../../application/cqrs/queries/get-enumeration.query.js';
import { GetEnumerationsQuery } from '../../application/cqrs/queries/get-enumerations.query.js';
import { Page } from '../../../shared/application/pagination/page.js';
import { Enumeration } from '../../domain/aggregates/enumeration.js';
import { NotFoundError } from '../../../shared/domain/errors/errors.js';
import { DeleteEnumerationCommand } from '../../application/cqrs/commands/delete-enumeration.command.js';
import { UpdateEnumerationDto } from './dto/update-enumeration.dto.js';
import type { AuthenticatedUser } from '../../../shared/interfaces/http/authenticated-request.js';
import { CurrentUser } from '../../../shared/interfaces/http/current-user.decorator.js';
import { ApiErrors } from '../../../shared/interfaces/http/api-errors.decorator.js';

@UseGuards(JwtAuthGuard)
@Controller('v1/enumerations')
@ApiTags('Enumerations')
export class EnumerationController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get(':id')
  @ApiOperation({ operationId: 'findEnumerationById', summary: 'Find enumeration by id' })
  @ApiOkResponse({ type: EnumerationDto })
  async findById(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    const userId: string = user.id;
    const roles: string[] = user.roles;
    const query = new GetEnumerationQuery(id, userId, roles);
    const entity = await this.queryBus.execute<GetEnumerationQuery, Enumeration>(query);
    if (!entity) throw new NotFoundError('Skill not found', id);
    return EnumerationDto.fromEntity(entity);
  }

  @Get('')
  @ApiOperation({ operationId: 'findEnumerations', summary: 'Find enumerations by RSQL' })
  @ApiOkResponse({ type: EnumerationPageDto })
  async find(@Query() dto: PagedQueryDto, @CurrentUser() user: AuthenticatedUser): Promise<EnumerationPageDto> {
    const userId: string = user.id;
    const roles: string[] = user.roles;
    const query = new GetEnumerationsQuery(dto.q, dto.page, dto.size, userId, roles);
    const page = await this.queryBus.execute<GetEnumerationsQuery, Page<Enumeration>>(query);
    const mapped = page.content.map(category => EnumerationDto.fromEntity(category));
    return new Page<EnumerationDto>(mapped, page.pagination.page, page.pagination.size, page.pagination.totalElements);
  }

  @Post('')
  @HttpCode(201)
  @ApiOperation({ operationId: 'createEnumeration', summary: 'Create enumeration' })
  @ApiErrors()
  async create(@Body() createSkillDto: CreateEnumerationDto, @CurrentUser() user: AuthenticatedUser) {
    const userId: string = user.id;
    const roles: string[] = user.roles;
    const command = CreateEnumerationDto.toCommand(createSkillDto, userId, roles);
    const result = await this.commandBus.execute<CreateEnumerationDto, Enumeration>(command);
    return EnumerationDto.fromEntity(result);
  }

  @Patch(':id')
  @ApiOperation({ operationId: 'updateEnumeration', summary: 'Update enumeration' })
  @ApiErrors()
  async update(@Param('id') id: string, @Body() dto: UpdateEnumerationDto, @CurrentUser() user: AuthenticatedUser) {
    const userId: string = user.id;
    const roles: string[] = user.roles;
    const command = UpdateEnumerationDto.toCommand(id, dto, userId, roles);
    const result = await this.commandBus.execute<UpdateEnumerationDto, Enumeration>(command);
    return EnumerationDto.fromEntity(result);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ operationId: 'deleteEnumeration', summary: 'Delete enumeration' })
  @ApiErrors({ 404: 'Enumeration not found' })
  async delete(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    const userId: string = user.id;
    const roles: string[] = user.roles;
    const command = new DeleteEnumerationCommand(id, userId, roles);
    await this.commandBus.execute(command);
  }
}
