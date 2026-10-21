/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../../shared/infrastructure/security/jwt-auth.guard';
import { ErrorDto } from '../../../shared/interfaces/http/dto/error-dto';
import { ResistanceRollQuery } from '../../application/cqrs/queries/resistance-roll.query';
import { ResistanceRollQueryDto } from './dto/resistance-roll-query.dto';
import { ResistanceRollResultDto } from './dto/resistance-roll-result.dto';
import { ResistanceRollResult } from '../../domain/value-objects/resistance-roll-result';

@UseGuards(JwtAuthGuard)
@Controller('v1/resistance-rolls')
@ApiTags('Resistance rolls')
export class ResistanceRollController {
  constructor(private queryBus: QueryBus) {}

  @Post()
  @ApiOperation({ operationId: 'resistanceRoll', summary: 'Get resistance roll result' })
  @ApiOkResponse({ type: ResistanceRollResultDto, description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing authentication token', type: ErrorDto })
  async resistanceRoll(@Body() dto: ResistanceRollQueryDto, @Request() req): Promise<ResistanceRollResultDto> {
    const userId = req.user!.id as string;
    const roles = req.user!.roles as string[];
    const query = ResistanceRollQueryDto.toQuery(dto, userId, roles);
    const result = await this.queryBus.execute<ResistanceRollQuery, ResistanceRollResult>(query);
    return ResistanceRollResultDto.fromEntity(result);
  }
}
