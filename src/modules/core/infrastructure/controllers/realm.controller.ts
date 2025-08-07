/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Controller, Delete, Get, Inject, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt.auth.guard';
import { CreateRealmUseCase } from '../../application/use-cases/create-realm.usecase';
import { DeleteRealmUseCase } from '../../application/use-cases/delete-realm.usecase';
import { UpdateRealmUseCase } from '../../application/use-cases/update-realm.usecase';
import * as realmRepository from '../../application/ports/outbound/realm-repository';
import { UpdateRealmCommand } from '../../application/commands/update-realm.command';
import { CreateRealmCommand } from '../../application/commands/create-realm.command';
import { PagedQueryDto } from './dto/paged-rsql-query';

@UseGuards(JwtAuthGuard)
@Controller('v1/realms')
@ApiTags('Realms')
export class RealmController {
  constructor(
    private readonly createRealmUseCase: CreateRealmUseCase,
    private readonly updateRealmUseCase: UpdateRealmUseCase,
    private readonly deleteRealmUseCase: DeleteRealmUseCase,
    @Inject('RealmRepository') private readonly realmRepository: realmRepository.RealmRepository,
  ) {}

  @Get(':id')
  findById(@Param('id') id: string) {
    //TODO convertir to use case for authenticated user
    // const userId = req.user!.id as string;
    return this.realmRepository.findById(id);
  }

  @Get('')
  find(@Query() query: PagedQueryDto) {
    //TODO convertir to use case for authenticated user
    // const userId = req.user!.id as string;
    return this.realmRepository.findByRsql(query.q, query.page, query.size);
  }

  @Post('')
  create(@Request() req) {
    const userId = req.user!.id as string;
    const command: CreateRealmCommand = {
      ...req.body,
      username: userId,
    };
    return this.createRealmUseCase.execute(command);
  }

  @Patch(':id')
  updateSettings(@Param('id') id: string, @Request() req) {
    // const userId = req.user!.id as string;
    const command: UpdateRealmCommand = {
      ...req.body,
      id: id,
    };
    return this.updateRealmUseCase.execute(command);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Request() req) {
    const userId = req.user!.id;
    const command = {
      id: id,
      username: userId,
    };
    return this.deleteRealmUseCase.execute(command);
  }
}
