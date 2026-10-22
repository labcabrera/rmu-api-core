import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../shared/infrastructure/security/jwt-auth.guard.js';
import { Page } from '../../../shared/application/pagination/page.js';
import { PagedQueryDto } from '../../../shared/interfaces/http/dto/paged-rsql-query.js';
import { DeleteEffectTypeCommand } from '../../application/cqrs/commands/delete-effect-type.command.js';
import { GetEffectTypeQuery } from '../../application/cqrs/queries/get-effect-type.query.js';
import { GetEffectTypesQuery } from '../../application/cqrs/queries/get-effect-types.query.js';
import { EffectType } from '../../domain/aggregates/effect-type.js';
import { CreateEffectTypeDto } from './dto/create-effect-type.dto.js';
import { EffectTypeDto, EffectTypePageDto } from './dto/effect-type.dto.js';
import { UpdateEffectTypeDto } from './dto/update-effect-type.dto.js';
import type { AuthenticatedUser } from '../../../shared/interfaces/http/authenticated-request.js';
import { CurrentUser } from '../../../shared/interfaces/http/current-user.decorator.js';
import { ApiErrors } from '../../../shared/interfaces/http/api-errors.decorator.js';

@UseGuards(JwtAuthGuard)
@Controller('v1/effect-types')
@ApiTags('Effect Types')
export class EffectTypeController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get(':id')
  @ApiOperation({ operationId: 'findEffectTypeById', summary: 'Find effect type by id' })
  @ApiOkResponse({ type: EffectTypeDto })
  @ApiErrors({ 404: 'Effect type not found' })
  async findById(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    const userId: string = user.id;
    const roles: string[] = user.roles;
    const query = new GetEffectTypeQuery(id, userId, roles);
    const entity = await this.queryBus.execute<GetEffectTypeQuery, EffectType>(query);
    return EffectTypeDto.fromEntity(entity);
  }

  @Get('')
  @ApiOperation({ operationId: 'findEffectTypes', summary: 'Find effect types by RSQL' })
  @ApiOkResponse({ type: EffectTypePageDto })
  async find(@Query() dto: PagedQueryDto, @CurrentUser() user: AuthenticatedUser): Promise<EffectTypePageDto> {
    const userId: string = user.id;
    const roles: string[] = user.roles;
    const query = new GetEffectTypesQuery(dto.q, dto.page, dto.size, userId, roles);
    const page = await this.queryBus.execute<GetEffectTypesQuery, Page<EffectType>>(query);
    const mapped = page.content.map(effectType => EffectTypeDto.fromEntity(effectType));
    return new Page<EffectTypeDto>(mapped, page.pagination.page, page.pagination.size, page.pagination.totalElements);
  }

  @Post('')
  @HttpCode(201)
  @ApiOperation({ operationId: 'createEffectType', summary: 'Create effect type' })
  @ApiErrors()
  async create(@Body() dto: CreateEffectTypeDto, @CurrentUser() user: AuthenticatedUser) {
    const userId: string = user.id;
    const roles: string[] = user.roles;
    const command = CreateEffectTypeDto.toCommand(dto, userId, roles);
    const result = await this.commandBus.execute<CreateEffectTypeDto, EffectType>(command);
    return EffectTypeDto.fromEntity(result);
  }

  @Patch(':id')
  @ApiOperation({ operationId: 'updateEffectType', summary: 'Update effect type' })
  @ApiErrors({ 404: 'Effect type not found' })
  async update(@Param('id') id: string, @Body() dto: UpdateEffectTypeDto, @CurrentUser() user: AuthenticatedUser) {
    const userId: string = user.id;
    const roles: string[] = user.roles;
    const command = UpdateEffectTypeDto.toCommand(id, dto, userId, roles);
    const result = await this.commandBus.execute<UpdateEffectTypeDto, EffectType>(command);
    return EffectTypeDto.fromEntity(result);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ operationId: 'deleteEffectType', summary: 'Delete effect type' })
  @ApiErrors({ 404: 'Effect type not found' })
  async delete(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    const userId: string = user.id;
    const roles: string[] = user.roles;
    const command = new DeleteEffectTypeCommand(id, userId, roles);
    await this.commandBus.execute(command);
  }
}
