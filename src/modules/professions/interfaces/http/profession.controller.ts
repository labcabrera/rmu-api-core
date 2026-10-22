import { Controller, Get, Param, UseGuards, Query, Post, Body, HttpCode, Delete, Patch } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../shared/infrastructure/security/jwt-auth.guard.js';
import { ProfessionDto, ProfessionPageDto } from './dto/profession.dto.js';
import { GetProfessionQuery } from '../../application/cqrs/queries/get-profession.query.js';
import { Profession } from '../../domain/aggregates/profession.js';
import { GetProfessionsQuery } from '../../application/cqrs/queries/get-professions.query.js';
import { PagedQueryDto } from '../../../shared/interfaces/http/dto/paged-rsql-query.js';
import { Page } from '../../../shared/application/pagination/page.js';
import { CreateProfessionDto } from './dto/create-profession.dto.js';
import { DeleteProfessionCommand } from '../../application/cqrs/commands/delete-profession.command.js';
import { UpdateProfessionDto } from './dto/update-profession.dto.js';
import { CreateProfessionCommand } from '../../application/cqrs/commands/create-profession.command.js';
import { UpdateProfessionCommand } from '../../application/cqrs/commands/update-profession.command.js';
import type { AuthenticatedUser } from '../../../shared/interfaces/http/authenticated-request.js';
import { CurrentUser } from '../../../shared/interfaces/http/current-user.decorator.js';
import { ApiErrors } from '../../../shared/interfaces/http/api-errors.decorator.js';

@UseGuards(JwtAuthGuard)
@Controller('v1/professions')
@ApiTags('Professions')
export class ProfessionController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get(':id')
  @ApiOkResponse({ type: ProfessionDto })
  @ApiOperation({ operationId: 'findProfessionById', summary: 'Find profession by id' })
  @ApiErrors({ 404: 'Realm not found' })
  async findById(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    const userId: string = user.id;
    const roles: string[] = user.roles;
    const query = new GetProfessionQuery(id, userId, roles);
    const profession = await this.queryBus.execute<GetProfessionQuery, Profession>(query);
    return ProfessionDto.fromEntity(profession);
  }

  @Get('')
  @ApiOkResponse({ type: ProfessionPageDto })
  @ApiOperation({ operationId: 'findProfessions', summary: 'Find all professions' })
  @ApiErrors()
  async find(@Query() dto: PagedQueryDto, @CurrentUser() user: AuthenticatedUser) {
    const userId: string = user.id;
    const roles: string[] = user.roles;
    const query = new GetProfessionsQuery(dto.q, dto.page, dto.size, userId, roles);
    const page = await this.queryBus.execute<GetProfessionsQuery, Page<Profession>>(query);
    const mapped = page.content.map(profession => ProfessionDto.fromEntity(profession));
    return new Page<ProfessionDto>(mapped, page.pagination.page, page.pagination.size, page.pagination.totalElements);
  }

  @Post('')
  @ApiOperation({ operationId: 'createProfession', summary: 'Create a new profession' })
  @ApiOkResponse({ type: ProfessionDto, description: 'Success' })
  @ApiErrors({ 400: 'Bad request, invalid data', 409: 'Conflict, profession already exists' })
  async create(@Body() createProfessionDto: CreateProfessionDto, @CurrentUser() user: AuthenticatedUser) {
    const userId: string = user.id;
    const roles: string[] = user.roles;
    const command = CreateProfessionDto.toCommand(createProfessionDto, userId, roles);
    const entity = await this.commandBus.execute<CreateProfessionCommand, Profession>(command);
    return ProfessionDto.fromEntity(entity);
  }

  @Patch(':id')
  @ApiOperation({ operationId: 'updateProfession', summary: 'Update profession by id' })
  @ApiOkResponse({ type: ProfessionDto, description: 'Success' })
  @ApiErrors({ 400: 'Bad request, invalid data', 404: 'Profession not found' })
  async updateSettings(@Param('id') id: string, @Body() updateProfessionDto: UpdateProfessionDto, @CurrentUser() user: AuthenticatedUser) {
    const userId: string = user.id;
    const roles: string[] = user.roles;
    const command = UpdateProfessionDto.toCommand(id, updateProfessionDto, userId, roles);
    const entity = await this.commandBus.execute<UpdateProfessionCommand, Profession>(command);
    return ProfessionDto.fromEntity(entity);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ operationId: 'deleteProfession', summary: 'Delete profession by id' })
  @ApiErrors({ 404: 'Profession not found' })
  async delete(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    const userId: string = user.id;
    const roles: string[] = user.roles;
    const command = new DeleteProfessionCommand(id, userId, roles);
    await this.commandBus.execute(command);
  }
}
