/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { JwtAuthGuard } from 'src/modules/auth/jwt.auth.guard';
import { UpdateRealmCommand } from '../../application/commands/update-realm.command';
import { CreateRealmCommand } from '../../application/commands/create-realm.command';
import { PagedQueryDto } from './dto/paged-rsql-query';
import { GetRealmQuery } from '../../application/queries/get-realm.query';
import { GetRealmsQuery } from '../../application/queries/get-realms.query';
import { DeleteRealmCommand } from '../../application/commands/delete-realm.command';

@UseGuards(JwtAuthGuard)
@Controller('v1/realms')
@ApiTags('Realms')
export class RealmController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Get(':id')
  findById(@Param('id') id: string, @Request() req) {
    const userId: string = req.user!.id as string;
    const query = new GetRealmQuery(userId, id);
    return this.queryBus.execute(query);
  }

  @Get('')
  find(@Query() dto: PagedQueryDto, @Request() req) {
    const userId: string = req.user!.id as string;
    const query = new GetRealmsQuery(userId, dto.q, dto.page, dto.size);
    return this.queryBus.execute(query);
  }

  @Post('')
  create(@Request() req) {
    const user = req.user!;
    const command = new CreateRealmCommand(req.body.id as string, req.body.name as string, user.id as string, user.roles as string[]);
    return this.commandBus.execute(command);
  }

  @Patch(':id')
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
  delete(@Param('id') id: string, @Request() req) {
    const user = req.user!;
    const command = new DeleteRealmCommand(id, undefined, user.id as string, user.roles! as string[]);
    return this.commandBus.execute(command);
  }
}
