import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../../shared/infrastructure/security/jwt-auth.guard.js';
import { CreateTraitCommand } from '../../application/cqrs/commands/create-trait.command.js';
import { DeleteTraitCommand } from '../../application/cqrs/commands/delete-trait.command.js';
import { UpdateTraitCommand } from '../../application/cqrs/commands/update-trait.command.js';
import { Trait } from '../../domain/aggregates/trait.js';
import { UpdateTraitDto } from './dto/update-trait.dto.js';
import { TraitDto, TraitPageDto } from './dto/trait.dto.js';
import { CreateTraitDto } from './dto/create-trait.dto.js';
import { GetTraitsQuery } from '../../application/cqrs/queries/get-traits.query.js';
import { GetTraitQuery } from '../../application/cqrs/queries/get-trait.query.js';
import { Page } from '../../../shared/application/pagination/page.js';
import { CatalogPagedQueryDto } from '../../../shared/interfaces/http/dto/paged-rsql-query.js';
import type { AuthenticatedUser } from '../../../shared/interfaces/http/authenticated-request.js';
import { CurrentUser } from '../../../shared/interfaces/http/current-user.decorator.js';
import { ApiErrors } from '../../../shared/interfaces/http/api-errors.decorator.js';

@UseGuards(JwtAuthGuard)
@Controller('v1/traits')
@ApiTags('Traits')
export class TraitController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Get(':id')
  @ApiOperation({ operationId: 'findTraitById', summary: 'Find Trait by id' })
  @ApiOkResponse({ type: TraitDto, description: 'Success' })
  @ApiErrors({ 404: 'Trait not found' })
  async findById(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    const query = new GetTraitQuery(id, user.id, user.roles);
    const entity = await this.queryBus.execute<GetTraitQuery, Trait>(query);
    return TraitDto.fromEntity(entity);
  }

  @Get('')
  @ApiOperation({ operationId: 'findTraits', summary: 'Find Traits by RSQL' })
  @ApiOkResponse({ type: TraitPageDto, description: 'Success' })
  @ApiErrors({ 400: 'Invalid RSQL query' })
  async find(@Query() dto: CatalogPagedQueryDto, @CurrentUser() user: AuthenticatedUser) {
    const query = new GetTraitsQuery(dto.q, dto.page, dto.size, user.id, user.roles);
    const page = await this.queryBus.execute<GetTraitsQuery, Page<Trait>>(query);
    const mapped = page.content.map(Trait => TraitDto.fromEntity(Trait));
    return new Page<TraitDto>(mapped, page.pagination.page, page.pagination.size, page.pagination.totalElements);
  }

  @Post('')
  @ApiBody({ type: CreateTraitDto })
  @ApiOperation({ operationId: 'createTrait', summary: 'Create a new Trait' })
  @ApiOkResponse({ type: TraitDto, description: 'Success' })
  @ApiErrors({ 400: 'Bad request, invalid data', 403: 'Missing role', 409: 'Conflict, Trait already exists' })
  async create(@Body() dto: CreateTraitDto, @CurrentUser() user: AuthenticatedUser) {
    const command = CreateTraitDto.toCommand(dto, user.id, user.roles);
    const entity = await this.commandBus.execute<CreateTraitCommand, Trait>(command);
    return TraitDto.fromEntity(entity);
  }

  @Patch(':id')
  @ApiOperation({ operationId: 'updateTrait', summary: 'Update Trait' })
  @ApiOkResponse({ type: TraitDto, description: 'Success' })
  @ApiErrors({ 400: 'Bad request, invalid data', 404: 'Trait not found' })
  async updateSettings(@Param('id') id: string, @Body() dto: UpdateTraitDto, @CurrentUser() user: AuthenticatedUser) {
    const command = UpdateTraitDto.toCommand(id, dto, user.id, user.roles);
    const entity = await this.commandBus.execute<UpdateTraitCommand, Trait>(command);
    return TraitDto.fromEntity(entity);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ operationId: 'deleteTrait', summary: 'Delete Trait by id' })
  @ApiErrors({ 404: 'Trait not found' })
  async delete(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    const command = new DeleteTraitCommand(id, undefined, user.id, user.roles);
    await this.commandBus.execute(command);
  }
}
