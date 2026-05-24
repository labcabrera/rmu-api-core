/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt.auth.guard';
import { Page } from 'src/modules/shared/domain/entities/page';
import { ErrorDto } from 'src/modules/shared/interfaces/http/dto/error-dto';
import { PagedQueryDto } from 'src/modules/shared/interfaces/http/dto/paged-rsql-query';
import { DeleteEffectTypeCommand } from '../../application/cqrs/commands/delete-effect-type.command';
import { GetEffectTypeQuery } from '../../application/cqrs/queries/get-effect-type.query';
import { GetEffectTypesQuery } from '../../application/cqrs/queries/get-effect-types.query';
import { EffectType } from '../../domain/aggregates/effect-type';
import { CreateEffectTypeDto } from './dto/create-effect-type.dto';
import { EffectTypeDto, EffectTypePageDto } from './dto/effect-type.dto';
import { UpdateEffectTypeDto } from './dto/update-effect-type.dto';

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
  @ApiNotFoundResponse({ description: 'Effect type not found', type: ErrorDto })
  async findById(@Param('id') id: string, @Request() req) {
    const userId: string = req.user!.id as string;
    const roles: string[] = req.user!.roles as string[];
    const query = new GetEffectTypeQuery(id, userId, roles);
    const entity = await this.queryBus.execute<GetEffectTypeQuery, EffectType>(query);
    return EffectTypeDto.fromEntity(entity);
  }

  @Get('')
  @ApiOperation({ operationId: 'findEffectTypes', summary: 'Find effect types by RSQL' })
  @ApiOkResponse({ type: EffectTypePageDto })
  async find(@Query() dto: PagedQueryDto, @Request() req): Promise<EffectTypePageDto> {
    const userId: string = req.user!.id as string;
    const roles: string[] = req.user!.roles as string[];
    const query = new GetEffectTypesQuery(dto.q, dto.page, dto.size, userId, roles);
    const page = await this.queryBus.execute<GetEffectTypesQuery, Page<EffectType>>(query);
    const mapped = page.content.map(effectType => EffectTypeDto.fromEntity(effectType));
    return new Page<EffectTypeDto>(mapped, page.pagination.page, page.pagination.size, page.pagination.totalElements);
  }

  @Post('')
  @HttpCode(201)
  @ApiOperation({ operationId: 'createEffectType', summary: 'Create effect type' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing authentication token', type: ErrorDto })
  async create(@Body() dto: CreateEffectTypeDto, @Request() req) {
    const userId: string = req.user!.id as string;
    const roles: string[] = req.user!.roles as string[];
    const command = CreateEffectTypeDto.toCommand(dto, userId, roles);
    const result = await this.commandBus.execute<CreateEffectTypeDto, EffectType>(command);
    return EffectTypeDto.fromEntity(result);
  }

  @Patch(':id')
  @ApiOperation({ operationId: 'updateEffectType', summary: 'Update effect type' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing authentication token', type: ErrorDto })
  @ApiNotFoundResponse({ description: 'Effect type not found', type: ErrorDto })
  async update(@Param('id') id: string, @Body() dto: UpdateEffectTypeDto, @Request() req) {
    const userId: string = req.user!.id as string;
    const roles: string[] = req.user!.roles as string[];
    const command = UpdateEffectTypeDto.toCommand(id, dto, userId, roles);
    const result = await this.commandBus.execute<UpdateEffectTypeDto, EffectType>(command);
    return EffectTypeDto.fromEntity(result);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ operationId: 'deleteEffectType', summary: 'Delete effect type' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing authentication token', type: ErrorDto })
  @ApiNotFoundResponse({ description: 'Effect type not found', type: ErrorDto })
  async delete(@Param('id') id: string, @Request() req) {
    const userId: string = req.user!.id as string;
    const roles: string[] = req.user!.roles as string[];
    const command = new DeleteEffectTypeCommand(id, userId, roles);
    await this.commandBus.execute(command);
  }
}
