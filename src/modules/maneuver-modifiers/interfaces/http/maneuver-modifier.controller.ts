import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBody,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../shared/infrastructure/security/jwt-auth.guard.js';
import { Page } from '../../../shared/domain/entities/page.js';
import { ErrorDto } from '../../../shared/interfaces/http/dto/error-dto.js';
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
import type { AuthenticatedRequest } from '../../../shared/interfaces/http/authenticated-request.js';

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
  @ApiNotFoundResponse({ description: 'Maneuver modifier not found', type: ErrorDto })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing authentication token', type: ErrorDto })
  async findById(@Param('id') id: string, @Request() req: AuthenticatedRequest): Promise<ManeuverModifierDto> {
    const query = new GetManeuverModifierQuery(id, req.user.id, req.user.roles);
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
  @ApiNotFoundResponse({ description: 'Skill not found (skillId filter)', type: ErrorDto })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing authentication token', type: ErrorDto })
  @ApiResponse({ status: 400, description: 'Invalid RSQL query', type: ErrorDto })
  async find(
    @Query() dto: ManeuverModifierQueryDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<ManeuverModifierDto[] | Page<ManeuverModifierDto>> {
    const userId = req.user.id;
    const roles = req.user.roles;
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
  @ApiResponse({ status: 400, description: 'Bad request, invalid data', type: ErrorDto })
  @ApiResponse({ status: 409, description: 'Conflict, key already exists', type: ErrorDto })
  async create(@Body() dto: CreateManeuverModifierDto, @Request() req: AuthenticatedRequest): Promise<ManeuverModifierDto> {
    const command = CreateManeuverModifierDto.toCommand(dto, req.user.id, req.user.roles);
    const entity = await this.commandBus.execute<CreateManeuverModifierCommand, ManeuverModifier>(command);
    return ManeuverModifierDto.fromEntity(entity);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateManeuverModifierDto })
  @ApiOperation({ operationId: 'updateManeuverModifier', summary: 'Update maneuver modifier' })
  @ApiOkResponse({ type: ManeuverModifierDto })
  @ApiNotFoundResponse({ description: 'Maneuver modifier not found', type: ErrorDto })
  @ApiResponse({ status: 400, description: 'Bad request, invalid data', type: ErrorDto })
  @ApiResponse({ status: 409, description: 'Conflict, key already exists', type: ErrorDto })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateManeuverModifierDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<ManeuverModifierDto> {
    const command = UpdateManeuverModifierDto.toCommand(id, dto, req.user.id, req.user.roles);
    const entity = await this.commandBus.execute<UpdateManeuverModifierCommand, ManeuverModifier>(command);
    return ManeuverModifierDto.fromEntity(entity);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ operationId: 'deleteManeuverModifier', summary: 'Delete maneuver modifier' })
  @ApiNotFoundResponse({ description: 'Maneuver modifier not found', type: ErrorDto })
  async delete(@Param('id') id: string, @Request() req: AuthenticatedRequest): Promise<void> {
    const command = new DeleteManeuverModifierCommand(id, req.user.id, req.user.roles);
    await this.commandBus.execute(command);
  }
}
