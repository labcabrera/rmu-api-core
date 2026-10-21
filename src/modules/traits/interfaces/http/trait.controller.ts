/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBody, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
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
import { ErrorDto } from '../../../shared/interfaces/http/dto/error-dto.js';
import { Page } from '../../../shared/domain/entities/page.js';
import { PagedQueryDto } from '../../../shared/interfaces/http/dto/paged-rsql-query.js';

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
  @ApiUnauthorizedResponse({ description: 'Invalid or missing authentication token', type: ErrorDto })
  @ApiNotFoundResponse({ description: 'Trait not found', type: ErrorDto })
  async findById(@Param('id') id: string, @Request() req) {
    const user = req.user!;
    const query = new GetTraitQuery(id, user.id as string, user.roles as string[]);
    const entity = await this.queryBus.execute<GetTraitQuery, Trait>(query);
    return TraitDto.fromEntity(entity);
  }

  @Get('')
  @ApiOperation({ operationId: 'findTraits', summary: 'Find Traits by RSQL' })
  @ApiOkResponse({ type: TraitPageDto, description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing authentication token', type: ErrorDto })
  @ApiResponse({ status: 400, description: 'Invalid RSQL query', type: ErrorDto })
  async find(@Query() dto: PagedQueryDto, @Request() req) {
    const user = req.user!;
    const query = new GetTraitsQuery(dto.q, dto.page, dto.size, user.id as string, user.roles as string[]);
    const page = await this.queryBus.execute<GetTraitsQuery, Page<Trait>>(query);
    const mapped = page.content.map(Trait => TraitDto.fromEntity(Trait));
    return new Page<TraitDto>(mapped, page.pagination.page, page.pagination.size, page.pagination.totalElements);
  }

  @Post('')
  @ApiBody({ type: CreateTraitDto })
  @ApiOperation({ operationId: 'createTrait', summary: 'Create a new Trait' })
  @ApiOkResponse({ type: TraitDto, description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing authentication token', type: ErrorDto })
  @ApiResponse({ status: 400, description: 'Bad request, invalid data', type: ErrorDto })
  @ApiResponse({ status: 409, description: 'Conflict, Trait already exists', type: ErrorDto })
  async create(@Body() dto: CreateTraitDto, @Request() req) {
    const user = req.user!;
    const command = CreateTraitDto.toCommand(dto, user.id as string, user.roles as string[]);
    const entity = await this.commandBus.execute<CreateTraitCommand, Trait>(command);
    return TraitDto.fromEntity(entity);
  }

  @Patch(':id')
  @ApiOperation({ operationId: 'updateTrait', summary: 'Update Trait' })
  @ApiOkResponse({ type: TraitDto, description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing authentication token', type: ErrorDto })
  @ApiNotFoundResponse({ description: 'Trait not found', type: ErrorDto })
  @ApiResponse({ status: 400, description: 'Bad request, invalid data', type: ErrorDto })
  async updateSettings(@Param('id') id: string, @Body() dto: UpdateTraitDto, @Request() req) {
    const user = req.user!;
    const command = UpdateTraitDto.toCommand(id, dto, user.id as string, user.roles as string[]);
    const entity = await this.commandBus.execute<UpdateTraitCommand, Trait>(command);
    return TraitDto.fromEntity(entity);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ operationId: 'deleteTrait', summary: 'Delete Trait by id' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing authentication token', type: ErrorDto })
  @ApiNotFoundResponse({ description: 'Trait not found', type: ErrorDto })
  async delete(@Param('id') id: string, @Request() req) {
    const user = req.user!;
    const command = new DeleteTraitCommand(id, undefined, user.id as string, user.roles! as string[]);
    await this.commandBus.execute(command);
  }
}
