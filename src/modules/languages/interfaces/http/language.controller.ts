/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBody, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from 'src/modules/auth/jwt.auth.guard';
import { Language } from '../../domain/aggregates/language';
import { CreateLanguageCommand } from '../../application/cqrs/commands/create-language.command';
import { DeleteLanguageCommand } from '../../application/cqrs/commands/delete-language.command';
import { UpdateLanguageCommand } from '../../application/cqrs/commands/update-language.command';
import { GetLanguageQuery } from '../../application/cqrs/queries/get-language.query';
import { GetLanguagesQuery } from '../../application/cqrs/queries/get-languages.query';
import { LanguageDto, LanguagePageDto } from './dtos/language.dto';
import { CreateLanguageDto } from './dtos/create-language.dto';
import { UpdateLanguageDto } from './dtos/update-language.dto';
import { Page } from 'src/modules/shared/domain/entities/page';
import { ErrorDto } from 'src/modules/shared/interfaces/http/dto/error-dto';
import { PagedQueryDto } from 'src/modules/shared/interfaces/http/dto/paged-rsql-query';

@UseGuards(JwtAuthGuard)
@Controller('v1/languages')
@ApiTags('Languages')
export class LanguageController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Get(':id')
  @ApiOperation({ operationId: 'findLanguageById', summary: 'Find language by id' })
  @ApiOkResponse({ type: LanguageDto, description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing authentication token', type: ErrorDto })
  @ApiNotFoundResponse({ description: 'Language not found', type: ErrorDto })
  async findById(@Param('id') id: string, @Request() req) {
    const userId: string = req.user!.id as string;
    const roles: string[] = req.user!.roles as string[];
    const query = new GetLanguageQuery(id, userId, roles);
    const entity = await this.queryBus.execute<GetLanguageQuery, Language>(query);
    return LanguageDto.fromEntity(entity);
  }

  @Get('')
  @ApiOperation({ operationId: 'findLanguages', summary: 'Find languages by RSQL' })
  @ApiOkResponse({ type: LanguagePageDto, description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing authentication token', type: ErrorDto })
  @ApiResponse({ status: 400, description: 'Invalid RSQL query', type: ErrorDto })
  async find(@Query() dto: PagedQueryDto, @Request() req) {
    const userId: string = req.user!.id as string;
    const roles: string[] = req.user!.roles as string[];
    const query = new GetLanguagesQuery(dto.q, dto.page, dto.size, userId, roles);
    const page = await this.queryBus.execute<GetLanguagesQuery, Page<Language>>(query);
    const mapped = page.content.map((language) => LanguageDto.fromEntity(language));
    return new Page<LanguageDto>(mapped, page.pagination.page, page.pagination.size, page.pagination.totalElements);
  }

  @Post('')
  @ApiBody({ type: CreateLanguageDto })
  @ApiOperation({ operationId: 'createLanguage', summary: 'Create a new language' })
  @ApiOkResponse({ type: LanguageDto, description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing authentication token', type: ErrorDto })
  @ApiResponse({ status: 400, description: 'Bad request, invalid data', type: ErrorDto })
  @ApiResponse({ status: 409, description: 'Conflict, language already exists', type: ErrorDto })
  async create(@Body() dto: CreateLanguageDto, @Request() req) {
    const user = req.user!;
    const command = CreateLanguageDto.toCommand(dto, user.id as string, user.roles as string[]);
    const entity = await this.commandBus.execute<CreateLanguageCommand, Language>(command);
    return LanguageDto.fromEntity(entity);
  }

  @Patch(':id')
  @ApiOperation({ operationId: 'updateLanguage', summary: 'Update language' })
  @ApiOkResponse({ type: LanguageDto, description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing authentication token', type: ErrorDto })
  @ApiNotFoundResponse({ description: 'Language not found', type: ErrorDto })
  @ApiResponse({ status: 400, description: 'Bad request, invalid data', type: ErrorDto })
  async updateSettings(@Param('id') id: string, @Body() dto: UpdateLanguageDto, @Request() req) {
    const user = req.user!;
    const command = UpdateLanguageDto.toCommand(id, dto, user.id as string, user.roles as string[]);
    const entity = await this.commandBus.execute<UpdateLanguageCommand, Language>(command);
    return LanguageDto.fromEntity(entity);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ operationId: 'deleteLanguage', summary: 'Delete language by id' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing authentication token', type: ErrorDto })
  @ApiNotFoundResponse({ description: 'Language not found', type: ErrorDto })
  async delete(@Param('id') id: string, @Request() req) {
    const user = req.user!;
    const command = new DeleteLanguageCommand(id, user.id as string, user.roles! as string[]);
    await this.commandBus.execute(command);
  }
}
