/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Controller, Delete, Get, Inject, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt.auth.guard';
import { PagedQueryDto } from './dto/paged-rsql-query';
import { DeleteRaceUseCase } from '../../application/use-cases/delete-race.usecase';
import { UpdateRaceUseCase } from '../../application/use-cases/update-race.usecase';
import { CreateRaceUseCase } from '../../application/use-cases/create-race.usecase';
import * as raceRepository from '../../application/ports/outbound/race-repository';
import { UpdateRaceCommand } from '../../application/commands/update-race.command';
import { CreateRaceCommand } from '../../application/commands/create-race.command';

@UseGuards(JwtAuthGuard)
@Controller('v1/races')
@ApiTags('Races')
export class RaceController {
  constructor(
    private readonly createRaceUseCase: CreateRaceUseCase,
    private readonly updateRaceUseCase: UpdateRaceUseCase,
    private readonly deleteRaceUseCase: DeleteRaceUseCase,
    @Inject('RaceRepository') private readonly raceRepository: raceRepository.RaceRepository,
  ) {}

  @Get(':id')
  findById(@Param('id') id: string) {
    //TODO convertir to use case for authenticated user
    // const userId = req.user!.id as string;
    return this.raceRepository.findById(id);
  }

  @Get('')
  find(@Query() query: PagedQueryDto) {
    //TODO convertir to use case for authenticated user
    // const userId = req.user!.id as string;
    return this.raceRepository.findByRsql(query.q, query.page, query.size);
  }

  @Post('')
  create(@Request() req) {
    const userId = req.user!.id as string;
    const command: CreateRaceCommand = {
      ...req.body,
      username: userId,
    };
    return this.createRaceUseCase.execute(command);
  }

  @Patch(':id')
  updateSettings(@Param('id') id: string, @Request() req) {
    // const userId = req.user!.id as string;
    const command: UpdateRaceCommand = {
      ...req.body,
      id: id,
    };
    return this.updateRaceUseCase.execute(command);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Request() req) {
    const userId = req.user!.id;
    const command = {
      id: id,
      username: userId,
    };
    return this.deleteRaceUseCase.execute(command);
  }
}
