import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBody, ApiExtraModels, ApiOkResponse, ApiOperation, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../shared/infrastructure/security/jwt-auth.guard.js';
import { Page } from '../../../shared/application/pagination/page.js';
import { CreateManeuverModifierCommand } from '../../application/cqrs/commands/create-maneuver-modifier.command.js';
import { DeleteManeuverModifierCommand } from '../../application/cqrs/commands/delete-maneuver-modifier.command.js';
import { UpdateManeuverModifierCommand } from '../../application/cqrs/commands/update-maneuver-modifier.command.js';
import { FindApplicableManeuverModifiersQuery } from '../../application/cqrs/queries/find-applicable-maneuver-modifiers.query.js';
import { GetManeuverModifierQuery } from '../../application/cqrs/queries/get-maneuver-modifier.query.js';
import { GetManeuverModifiersQuery } from '../../application/cqrs/queries/get-maneuver-modifiers.query.js';
import { ManeuverModifier } from '../../domain/aggregates/maneuver-modifier.js';
import { CreateManeuverModifierDto } from './dto/create-maneuver-modifier.dto.js';
import { ManeuverModifierQueryDto } from './dto/maneuver-modifier-query.dto.js';
import { ManeuverModifierDto, ManeuverModifierPageDto } from './dto/maneuver-modifier.dto.js';
import { UpdateManeuverModifierDto } from './dto/update-maneuver-modifier.dto.js';
import type { AuthenticatedUser } from '../../../shared/interfaces/http/authenticated-request.js';
import { CurrentUser } from '../../../shared/interfaces/http/current-user.decorator.js';
import { ApiErrors } from '../../../shared/interfaces/http/api-errors.decorator.js';

@UseGuards(JwtAuthGuard)
@Controller('v1/maneuver-modifiers')
@ApiTags('Maneuver modifiers')
@ApiExtraModels(ManeuverModifierDto, ManeuverModifierPageDto)
export class ManeuverModifierController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get(':id')
  @ApiOperation({ operationId: 'findManeuverModifierById', summary: 'Find maneuver modifier by id' })
  @ApiOkResponse({ type: ManeuverModifierDto })
  @ApiErrors({ 404: 'Maneuver modifier not found' })
  async findById(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser): Promise<ManeuverModifierDto> {
    const query = new GetManeuverModifierQuery(id, user.id, user.roles);
    const entity = await this.queryBus.execute<GetManeuverModifierQuery, ManeuverModifier>(query);
    return ManeuverModifierDto.fromEntity(entity);
  }

  @Get('')
  @ApiOperation({
    operationId: 'findManeuverModifiers',
    summary: 'Find maneuver modifiers',
    description:
      'With skillId and/or categoryId returns a plain array with the modifiers whose scope contains the skill or the category ' +
      '(with only skillId, the category of the skill is resolved too). Without them returns a page filtered by RSQL.',
  })
  @ApiOkResponse({
    schema: {
      oneOf: [{ type: 'array', items: { $ref: getSchemaPath(ManeuverModifierDto) } }, { $ref: getSchemaPath(ManeuverModifierPageDto) }],
    },
  })
  @ApiErrors({ 400: 'Invalid RSQL query', 404: 'Skill not found (skillId filter)' })
  async find(
    @Query() dto: ManeuverModifierQueryDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ManeuverModifierDto[] | Page<ManeuverModifierDto>> {
    const userId = user.id;
    const roles = user.roles;
    if (dto.skillId || dto.categoryId) {
      const query = new FindApplicableManeuverModifiersQuery(dto.skillId, dto.categoryId, userId, roles);
      const list = await this.queryBus.execute<FindApplicableManeuverModifiersQuery, ManeuverModifier[]>(query);
      return list.map(entity => ManeuverModifierDto.fromEntity(entity));
    }
    const query = new GetManeuverModifiersQuery(dto.q, dto.page, dto.size, userId, roles);
    const page = await this.queryBus.execute<GetManeuverModifiersQuery, Page<ManeuverModifier>>(query);
    const mapped = page.content.map(entity => ManeuverModifierDto.fromEntity(entity));
    return new Page<ManeuverModifierDto>(mapped, page.pagination.page, page.pagination.size, page.pagination.totalElements);
  }

  @Post('')
  @HttpCode(201)
  @ApiBody({ type: CreateManeuverModifierDto })
  @ApiOperation({ operationId: 'createManeuverModifier', summary: 'Create maneuver modifier' })
  @ApiOkResponse({ type: ManeuverModifierDto })
  @ApiErrors({ 400: 'Bad request, invalid data', 409: 'Conflict, key already exists' })
  async create(@Body() dto: CreateManeuverModifierDto, @CurrentUser() user: AuthenticatedUser): Promise<ManeuverModifierDto> {
    const command = CreateManeuverModifierDto.toCommand(dto, user.id, user.roles);
    const entity = await this.commandBus.execute<CreateManeuverModifierCommand, ManeuverModifier>(command);
    return ManeuverModifierDto.fromEntity(entity);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateManeuverModifierDto })
  @ApiOperation({ operationId: 'updateManeuverModifier', summary: 'Update maneuver modifier' })
  @ApiOkResponse({ type: ManeuverModifierDto })
  @ApiErrors({ 400: 'Bad request, invalid data', 404: 'Maneuver modifier not found', 409: 'Conflict, key already exists' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateManeuverModifierDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ManeuverModifierDto> {
    const command = UpdateManeuverModifierDto.toCommand(id, dto, user.id, user.roles);
    const entity = await this.commandBus.execute<UpdateManeuverModifierCommand, ManeuverModifier>(command);
    return ManeuverModifierDto.fromEntity(entity);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ operationId: 'deleteManeuverModifier', summary: 'Delete maneuver modifier' })
  @ApiErrors({ 404: 'Maneuver modifier not found' })
  async delete(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser): Promise<void> {
    const command = new DeleteManeuverModifierCommand(id, user.id, user.roles);
    await this.commandBus.execute(command);
  }
}
