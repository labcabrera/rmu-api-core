/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Get, Param, Query, UseGuards, Post, Body, Request, Delete, HttpCode, Patch } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
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
import { DeleteEnumerationCommand } from '../../application/cqrs/commands/delete-enumeration.command';
import { ErrorDto } from 'src/modules/shared/interfaces/http/dto/error-dto';
import { UpdateEnumerationDto } from './dto/update-enumeration.dto';

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
  async findById(@Param('id') id: string, @Request() req) {
    const userId: string = req.user!.id as string;
    const roles: string[] = req.user!.roles as string[];
    const query = new GetEnumerationQuery(id, userId, roles);
    const entity = await this.queryBus.execute<GetEnumerationQuery, Enumeration>(query);
    if (!entity) throw new NotFoundError('Skill not found', id);
    return EnumerationDto.fromEntity(entity);
  }

  @Get('')
  @ApiOperation({ operationId: 'findEnumerations', summary: 'Find enumerations by RSQL' })
  @ApiOkResponse({ type: EnumerationPageDto })
  async find(@Query() dto: PagedQueryDto, @Request() req): Promise<EnumerationPageDto> {
    const userId: string = req.user!.id as string;
    const roles: string[] = req.user!.roles as string[];
    const query = new GetEnumerationsQuery(dto.q, dto.page, dto.size, userId, roles);
    const page = await this.queryBus.execute<GetEnumerationsQuery, Page<Enumeration>>(query);
    const mapped = page.content.map(category => EnumerationDto.fromEntity(category));
    return new Page<EnumerationDto>(mapped, page.pagination.page, page.pagination.size, page.pagination.totalElements);
  }

  @Post('')
  @HttpCode(201)
  @ApiOperation({ operationId: 'createEnumeration', summary: 'Create enumeration' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing authentication token', type: ErrorDto })
  async create(@Body() createSkillDto: CreateEnumerationDto, @Request() req) {
    const userId: string = req.user!.id as string;
    const roles: string[] = req.user!.roles as string[];
    const command = CreateEnumerationDto.toCommand(createSkillDto, userId, roles);
    const result = await this.commandBus.execute<CreateEnumerationDto, Enumeration>(command);
    return EnumerationDto.fromEntity(result);
  }

  @Patch(':id')
  @ApiOperation({ operationId: 'updateEnumeration', summary: 'Update enumeration' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing authentication token', type: ErrorDto })
  async update(@Param('id') id: string, @Body() dto: UpdateEnumerationDto, @Request() req) {
    const userId: string = req.user!.id as string;
    const roles: string[] = req.user!.roles as string[];
    const command = UpdateEnumerationDto.toCommand(id, dto, userId, roles);
    const result = await this.commandBus.execute<UpdateEnumerationDto, Enumeration>(command);
    return EnumerationDto.fromEntity(result);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ operationId: 'deleteEnumeration', summary: 'Delete enumeration' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing authentication token', type: ErrorDto })
  @ApiNotFoundResponse({ description: 'Enumeration not found', type: ErrorDto })
  async delete(@Param('id') id: string, @Request() req) {
    const userId: string = req.user!.id as string;
    const roles: string[] = req.user!.roles as string[];
    const command = new DeleteEnumerationCommand(id, userId, roles);
    await this.commandBus.execute(command);
  }
}
