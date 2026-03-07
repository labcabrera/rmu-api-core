/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Get, Param, UseGuards, Request, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt.auth.guard';
import { ProfessionDto, ProfessionPageDto } from './dtos/profession.dto';
import { GetProfessionQuery } from '../../application/cqrs/queries/get-profession.query';
import { Profession, ProfessionProps } from '../../domain/aggregates/profession';
import { GetProfessionsQuery } from '../../application/cqrs/queries/get-professions.query';
import { ErrorDto } from 'src/modules/shared/interfaces/http/dto/error-dto';
import { PagedQueryDto } from 'src/modules/shared/interfaces/http/dto/paged-rsql-query';
import { Page } from 'src/modules/shared/domain/entities/page';

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
    const profession = await this.queryBus.execute<GetProfessionQuery, ProfessionProps>(query);
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
}
