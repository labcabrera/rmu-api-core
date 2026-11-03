import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
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
import { RealmQueryDto } from './dto/realm-query.dto.js';
import type { AuthenticatedUser } from '../../../shared/interfaces/http/authenticated-request.js';
import { CurrentUser } from '../../../shared/interfaces/http/current-user.decorator.js';
import { ApiErrors, FORBIDDEN_CHANGE, FORBIDDEN_CREATE } from '../../../shared/interfaces/http/api-errors.decorator.js';
import { ShareRealmDto } from './dto/share-realm.dto.js';
import { ShareRealmCommand } from '../../application/cqrs/commands/share-realm.command.js';
import { UnshareRealmCommand } from '../../application/cqrs/commands/unshare-realm.command.js';
import { GetRealmSharesQuery } from '../../application/cqrs/queries/get-realm-shares.query.js';
import { EntityShareDto } from '../../../shared/interfaces/http/dto/entity-share.dto.js';
import type { EntityShare } from '../../../shared/domain/entities/entity-share.js';
import { GetRealmAccessQuery } from '../../application/cqrs/queries/get-realm-access.query.js';
import type { AccessLevel } from '../../../shared/domain/services/entity-access.js';
import { RealmAccessDto } from './dto/realm-access.dto.js';
import { RealmAccessMapQueryDto, RealmLevelDto } from './dto/realm-access-map.dto.js';
import { GetRealmAccessMapQuery } from '../../application/cqrs/queries/get-realm-access-map.query.js';
import type { RealmLevel } from '../../application/cqrs/handlers/get-realm-access-map.handler.js';

@UseGuards(JwtAuthGuard)
@Controller('v1/realms')
@ApiTags('Realms')
export class RealmController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  // Before `:id`, which would take `access` for a realm id.
  @Get('access')
  @ApiOperation({
    operationId: 'findRealmAccessMap',
    summary: 'Every realm a user reads, with the level, for other APIs with the service token (spec 073)',
  })
  @ApiOkResponse({ type: [RealmLevelDto], description: 'Success' })
  @ApiErrors({ 400: 'Missing userId', 403: 'The caller is not an admin (the service account)' })
  async findAccessMap(@Query() dto: RealmAccessMapQueryDto, @CurrentUser() user: AuthenticatedUser) {
    return this.queryBus.execute<GetRealmAccessMapQuery, RealmLevel[]>(new GetRealmAccessMapQuery(dto.userId, user.id, user.roles));
  }

  @Get(':id')
  @ApiOperation({ operationId: 'findRealmById', summary: 'Find realm by id' })
  @ApiOkResponse({ type: RealmDto, description: 'Success' })
  @ApiErrors({ 404: 'Realm not found' })
  async findById(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    const query = new GetRealmQuery(id, user.id, user.roles);
    const entity = await this.queryBus.execute<GetRealmQuery, Realm>(query);
    return RealmDto.fromEntity(entity, user);
  }

  @Get('')
  @ApiOperation({ operationId: 'findRealms', summary: 'Find realms by RSQL' })
  @ApiOkResponse({ type: RealmPageDto, description: 'Success' })
  @ApiErrors({ 400: 'Invalid RSQL query' })
  async find(@Query() dto: RealmQueryDto, @CurrentUser() user: AuthenticatedUser) {
    const userId: string = user.id;
    const roles: string[] = user.roles;
    const query = new GetRealmsQuery(dto.q, dto.page, dto.size, userId, roles, dto.scope);
    const page = await this.queryBus.execute<GetRealmsQuery, Page<Realm>>(query);
    const mapped = page.content.map(realm => RealmDto.fromEntity(realm, user));
    return new Page<RealmDto>(mapped, page.pagination.page, page.pagination.size, page.pagination.totalElements);
  }

  @Post('')
  @ApiBody({ type: CreateRealmDto })
  @ApiOperation({ operationId: 'createRealm', summary: 'Create a new realm' })
  @ApiOkResponse({ type: RealmDto, description: 'Success' })
  @ApiErrors({
    400: 'Bad request, invalid data',
    403: `${FORBIDDEN_CREATE}, or generic set by a non-admin`,
    409: 'Conflict, realm already exists',
  })
  async create(@Body() dto: CreateRealmDto, @CurrentUser() user: AuthenticatedUser) {
    const command = CreateRealmDto.toCommand(dto, user.id, user.roles);
    const entity = await this.commandBus.execute<CreateRealmCommand, Realm>(command);
    return RealmDto.fromEntity(entity, user);
  }

  @Patch(':id')
  @ApiOperation({ operationId: 'updateRealm', summary: 'Update realm' })
  @ApiOkResponse({ type: RealmDto, description: 'Success' })
  @ApiErrors({ 400: 'Bad request, invalid data', 403: `${FORBIDDEN_CHANGE}, or generic changed by a non-admin`, 404: 'Realm not found' })
  async updateSettings(@Param('id') id: string, @Body() dto: UpdateRealmDto, @CurrentUser() user: AuthenticatedUser) {
    const command = UpdateRealmDto.toCommand(id, dto, user.id, user.roles);
    const entity = await this.commandBus.execute<UpdateRealmCommand, Realm>(command);
    return RealmDto.fromEntity(entity, user);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ operationId: 'deleteRealm', summary: 'Delete realm by id' })
  @ApiErrors({ 403: `${FORBIDDEN_CHANGE}; a realm with system races, admin only`, 404: 'Realm not found' })
  async delete(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    const command = new DeleteRealmCommand(id, user.id, user.roles);
    await this.commandBus.execute(command);
  }

  @Get(':id/shares')
  @ApiOperation({ operationId: 'findRealmShares', summary: 'Who the realm is shared with (spec 069): only for who manages it' })
  @ApiOkResponse({ type: [EntityShareDto], description: 'Success' })
  @ApiErrors({ 403: 'Not the owner or an admin', 404: 'Realm not found' })
  async findShares(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    const shares = await this.queryBus.execute<GetRealmSharesQuery, readonly EntityShare[]>(
      new GetRealmSharesQuery(id, user.id, user.roles),
    );
    return shares.map(share => EntityShareDto.fromShare(share));
  }

  @Get(':id/access/:userId')
  @ApiOperation({
    operationId: 'findRealmAccess',
    summary: 'Access of a user to the realm, for other APIs with the service token (spec 071)',
  })
  @ApiOkResponse({ type: RealmAccessDto, description: 'Success' })
  @ApiErrors({ 403: 'The caller is not an admin (the service account)', 404: 'Realm not found' })
  async findAccess(@Param('id') id: string, @Param('userId') userId: string, @CurrentUser() user: AuthenticatedUser) {
    const level = await this.queryBus.execute<GetRealmAccessQuery, AccessLevel>(new GetRealmAccessQuery(id, userId, user.id, user.roles));
    return { realmId: id, userId, level } satisfies RealmAccessDto;
  }

  @Put(':id/shares/:userId')
  @ApiBody({ type: ShareRealmDto })
  @ApiOperation({ operationId: 'shareRealm', summary: 'Give a friend read or write access to the realm, or change the level given' })
  @ApiOkResponse({ type: RealmDto, description: 'Success' })
  @ApiErrors({
    400: 'Invalid level; not an accepted friend of the owner (share-not-friend); the owner (share-self); too many shares (share-limit-reached)',
    403: 'Not the owner or an admin',
    404: 'Realm not found',
    409: 'Stale version',
  })
  async share(
    @Param('id') id: string,
    @Param('userId') targetUserId: string,
    @Body() dto: ShareRealmDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const command = new ShareRealmCommand(id, targetUserId, dto.level, user.id, user.roles, dto.version);
    const entity = await this.commandBus.execute<ShareRealmCommand, Realm>(command);
    return RealmDto.fromEntity(entity, user);
  }

  @Delete(':id/shares/:userId')
  @ApiOperation({ operationId: 'unshareRealm', summary: 'Remove the access of a user: by who manages the realm, or by that user' })
  @ApiOkResponse({ type: RealmDto, description: 'Success' })
  @ApiErrors({ 403: 'Not the owner, an admin or the user that had the access', 404: 'Realm not found', 409: 'Stale version' })
  async unshare(
    @Param('id') id: string,
    @Param('userId') targetUserId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Query('version', new ParseIntPipe({ optional: true })) version?: number,
  ) {
    const command = new UnshareRealmCommand(id, targetUserId, user.id, user.roles, version);
    const entity = await this.commandBus.execute<UnshareRealmCommand, Realm>(command);
    return RealmDto.fromEntity(entity, user);
  }
}
