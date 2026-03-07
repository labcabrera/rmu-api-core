/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Get, Param, UseGuards, Request, Query, Post, Body, HttpCode, Delete } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt.auth.guard';
import { ProfessionDto, ProfessionPageDto } from './dtos/profession.dto';
import { GetProfessionQuery } from '../../application/cqrs/queries/get-profession.query';
import { Profession } from '../../domain/aggregates/profession';
import { GetProfessionsQuery } from '../../application/cqrs/queries/get-professions.query';
import { ErrorDto } from 'src/modules/shared/interfaces/http/dto/error-dto';
import { PagedQueryDto } from 'src/modules/shared/interfaces/http/dto/paged-rsql-query';
import { Page } from 'src/modules/shared/domain/entities/page';
import { CreateProfessionDto } from './dtos/create-profession.dto';
import { DeleteProfessionCommand } from '../../application/cqrs/commands/delete-profession.command';

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
  @ApiUnauthorizedResponse({ description: 'Invalid or missing authentication token', type: ErrorDto })
  @ApiNotFoundResponse({ description: 'Realm not found', type: ErrorDto })
  async findById(@Param('id') id: string, @Request() req) {
    const userId: string = req.user!.id as string;
    const roles: string[] = req.user!.roles as string[];
    const query = new GetProfessionQuery(id, userId, roles);
    const profession = await this.queryBus.execute<GetProfessionQuery, Profession>(query);
    return ProfessionDto.fromEntity(profession);
  }

  @Get('')
  @ApiOkResponse({ type: ProfessionPageDto })
  @ApiOperation({ operationId: 'findProfessions', summary: 'Find all professions' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing authentication token', type: ErrorDto })
  async find(@Query() dto: PagedQueryDto, @Request() req) {
    const userId: string = req.user!.id as string;
    const roles: string[] = req.user!.roles as string[];
    const query = new GetProfessionsQuery(dto.q, dto.page, dto.size, userId, roles);
    const page = await this.queryBus.execute<GetProfessionsQuery, Page<Profession>>(query);
    const mapped = page.content.map((profession) => ProfessionDto.fromEntity(profession));
    return new Page<ProfessionDto>(mapped, page.pagination.page, page.pagination.size, page.pagination.totalElements);
  }

  @Post('')
  @ApiOperation({ operationId: 'createProfession', summary: 'Create a new profession' })
  @ApiOkResponse({ type: ProfessionDto, description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing authentication token', type: ErrorDto })
  @ApiResponse({ status: 400, description: 'Bad request, invalid data', type: ErrorDto })
  @ApiResponse({ status: 409, description: 'Conflict, profession already exists', type: ErrorDto })
  async create(@Body() createProfessionDto: CreateProfessionDto, @Request() req) {
    const userId: string = req.user!.id as string;
    const roles: string[] = req.user!.roles as string[];
    const command = CreateProfessionDto.toCommand(createProfessionDto, userId, roles);
    const entity = await this.commandBus.execute(command);
    return ProfessionDto.fromEntity(entity);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ operationId: 'deleteProfession', summary: 'Delete profession by id' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing authentication token', type: ErrorDto })
  @ApiNotFoundResponse({ description: 'Profession not found', type: ErrorDto })
  async delete(@Param('id') id: string, @Request() req) {
    const userId: string = req.user!.id as string;
    const roles: string[] = req.user!.roles as string[];
    const command = new DeleteProfessionCommand(id, userId, roles);
    await this.commandBus.execute(command);
  }
}
