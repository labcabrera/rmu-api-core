/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';

import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { JwtAuthGuard } from 'src/modules/auth/jwt.auth.guard';
import { UpdateRealmCommand } from '../../application/commands/update-realm.command';
import { CreateRealmCommand } from '../../application/commands/create-realm.command';
import { PagedQueryDto } from './dto/paged-rsql-query';
import { GetRealmQuery } from '../../application/queries/get-realm.query';
import { GetRealmsQuery } from '../../application/queries/get-realms.query';
import { DeleteRealmCommand } from '../../application/commands/delete-realm.command';
import { CreateRealmDto, RealmDto } from './dto/realm.dto';
import { Realm } from '../../domain/entities/realm';
import { Page } from '../../domain/entities/page';

@UseGuards(JwtAuthGuard)
@Controller('v1/realms')
@ApiTags('Realms')
export class RealmController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Get(':id')
  @ApiOkResponse({ type: RealmDto })
  @ApiOperation({ operationId: 'findRealmById' })
  async findById(@Param('id') id: string, @Request() req) {
    const query = new GetRealmQuery(id, req.user!.id as string);
    const entity = await this.queryBus.execute<GetRealmQuery, Realm>(query);
    return RealmDto.fromEntity(entity);
  }

  @Get('')
  @ApiOperation({ operationId: 'findRealms' })
  async find(@Query() dto: PagedQueryDto, @Request() req) {
    const userId: string = req.user!.id as string;
    const query = new GetRealmsQuery(userId, dto.q, dto.page, dto.size);
    const pagedEntities = await this.queryBus.execute<GetRealmsQuery, Page<Realm>>(query);
    const mappedContent = pagedEntities.content.map((realm) => RealmDto.fromEntity(realm));
    return new Page<RealmDto>(
      mappedContent,
      pagedEntities.pagination.page,
      pagedEntities.pagination.size,
      pagedEntities.pagination.totalElements,
    );
  }

  @Post('')
  @ApiBody({ type: CreateRealmDto })
  @ApiOperation({ operationId: 'createRealm' })
  async create(@Request() req) {
    const user = req.user!;
    const { id, name, description } = req.body;
    const command = new CreateRealmCommand(id, name, description, user.id as string, user.roles as string[]);
    console.log('Creating realm with command:', JSON.stringify(command));
    const entity = await this.commandBus.execute<CreateRealmCommand, Realm>(command);
    return RealmDto.fromEntity(entity);
  }

  @Patch(':id')
  @ApiOperation({ operationId: 'updateRealm' })
  updateSettings(@Param('id') id: string, @Request() req) {
    const user = req.user!;
    const command = new UpdateRealmCommand(
      id,
      req.body.name as string,
      req.body.description as string,
      user.id as string,
      user.roles as string[],
    );
    return this.commandBus.execute(command);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ operationId: 'deleteRealm' })
  async delete(@Param('id') id: string, @Request() req) {
    const user = req.user!;
    const command = new DeleteRealmCommand(id, undefined, user.id as string, user.roles! as string[]);
    await this.commandBus.execute(command);
  }
}
