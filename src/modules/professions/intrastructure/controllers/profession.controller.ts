/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt.auth.guard';
import { ProfessionDto } from './dtos/profession.dto';
import { GetProfessionQuery } from '../../application/queries/get-profession.query';
import { Profession } from '../../domain/entities/profession.entity';
import { ErrorDto } from 'src/modules/core/interfaces/http/dto/error-dto';
import { GetProfessionsQuery } from '../../application/queries/get-professions.query';

@UseGuards(JwtAuthGuard)
@Controller('v1/professions')
@ApiTags('Professions')
export class ProfessionController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':id')
  @ApiOkResponse({ type: ProfessionDto })
  @ApiOperation({ operationId: 'findProfessionById', summary: 'Find profession by id' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing authentication token', type: ErrorDto })
  @ApiNotFoundResponse({ description: 'Realm not found', type: ErrorDto })
  async findById(@Param('id') id: string, @Request() req) {
    const user = req.user!;
    const query = new GetProfessionQuery(id, user.id as string, user.roles as string[]);
    const profession = await this.queryBus.execute<GetProfessionQuery, Profession>(query);
    return ProfessionDto.fromEntity(profession);
  }

  @Get('')
  @ApiOkResponse({ type: [ProfessionDto] })
  @ApiOperation({ operationId: 'findProfessions', summary: 'Find all professions' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing authentication token', type: ErrorDto })
  async find(@Request() req) {
    const user = req.user!;
    const query = new GetProfessionsQuery(user.id as string, user.roles as string[]);
    const professions = await this.queryBus.execute<GetProfessionsQuery, Profession[]>(query);
    return professions.map((profession) => ProfessionDto.fromEntity(profession));
  }
}
