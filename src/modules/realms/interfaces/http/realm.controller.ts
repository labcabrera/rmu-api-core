import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../../shared/infrastructure/security/jwt-auth.guard.js';
import { GetRealmQuery } from '../../application/cqrs/queries/get-realm.query.js';
import { GetRealmsQuery } from '../../application/cqrs/queries/get-realms.query.js';
import { RealmDto, RealmPageDto } from './dto/realm.dto.js';
import { Realm } from '../../domain/aggregates/realm.js';
import { CreateRealmDto } from './dto/create-realm.dto.js';
import { UpdateRealmDto } from './dto/update-realm.dto.js';
import { CreateRealmCommand } from '../../application/cqrs/commands/create-realm.command.js';
import { DeleteRealmCommand } from '../../application/cqrs/commands/delete-realm.command.js';
import { UpdateRealmCommand } from '../../application/cqrs/commands/update-realm.command.js';
import { Page } from '../../../shared/application/pagination/page.js';
import { PagedQueryDto } from '../../../shared/interfaces/http/dto/paged-rsql-query.js';
import type { AuthenticatedUser } from '../../../shared/interfaces/http/authenticated-request.js';
import { CurrentUser } from '../../../shared/interfaces/http/current-user.decorator.js';
import { ApiErrors } from '../../../shared/interfaces/http/api-errors.decorator.js';

@UseGuards(JwtAuthGuard)
@Controller('v1/realms')
@ApiTags('Realms')
export class RealmController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Get(':id')
  @ApiOperation({ operationId: 'findRealmById', summary: 'Find realm by id' })
  @ApiOkResponse({ type: RealmDto, description: 'Success' })
  @ApiErrors({ 404: 'Realm not found' })
  async findById(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    const query = new GetRealmQuery(id, user.id, user.roles);
    const entity = await this.queryBus.execute<GetRealmQuery, Realm>(query);
    return RealmDto.fromEntity(entity);
  }

  @Get('')
  @ApiOperation({ operationId: 'findRealms', summary: 'Find realms by RSQL' })
  @ApiOkResponse({ type: RealmPageDto, description: 'Success' })
  @ApiErrors({ 400: 'Invalid RSQL query' })
  async find(@Query() dto: PagedQueryDto, @CurrentUser() user: AuthenticatedUser) {
    const userId: string = user.id;
    const roles: string[] = user.roles;
    const query = new GetRealmsQuery(dto.q, dto.page, dto.size, userId, roles);
    const page = await this.queryBus.execute<GetRealmsQuery, Page<Realm>>(query);
    const mapped = page.content.map(realm => RealmDto.fromEntity(realm));
    return new Page<RealmDto>(mapped, page.pagination.page, page.pagination.size, page.pagination.totalElements);
  }

  @Post('')
  @ApiBody({ type: CreateRealmDto })
  @ApiOperation({ operationId: 'createRealm', summary: 'Create a new realm' })
  @ApiOkResponse({ type: RealmDto, description: 'Success' })
  @ApiErrors({ 400: 'Bad request, invalid data', 409: 'Conflict, realm already exists' })
  async create(@Body() dto: CreateRealmDto, @CurrentUser() user: AuthenticatedUser) {
    const command = CreateRealmDto.toCommand(dto, user.id, user.roles);
    const entity = await this.commandBus.execute<CreateRealmCommand, Realm>(command);
    return RealmDto.fromEntity(entity);
  }

  @Patch(':id')
  @ApiOperation({ operationId: 'updateRealm', summary: 'Update realm' })
  @ApiOkResponse({ type: RealmDto, description: 'Success' })
  @ApiErrors({ 400: 'Bad request, invalid data', 404: 'Realm not found' })
  async updateSettings(@Param('id') id: string, @Body() dto: UpdateRealmDto, @CurrentUser() user: AuthenticatedUser) {
    const command = UpdateRealmDto.toCommand(id, dto, user.id, user.roles);
    const entity = await this.commandBus.execute<UpdateRealmCommand, Realm>(command);
    return RealmDto.fromEntity(entity);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ operationId: 'deleteRealm', summary: 'Delete realm by id' })
  @ApiErrors({ 404: 'Realm not found' })
  async delete(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    const command = new DeleteRealmCommand(id, user.id, user.roles);
    await this.commandBus.execute(command);
  }
}
