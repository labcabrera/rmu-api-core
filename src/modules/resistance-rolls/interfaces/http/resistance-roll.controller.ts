import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../../shared/infrastructure/security/jwt-auth.guard.js';
import { ResistanceRollQuery } from '../../application/cqrs/queries/resistance-roll.query.js';
import { ResistanceRollQueryDto } from './dto/resistance-roll-query.dto.js';
import { ResistanceRollResultDto } from './dto/resistance-roll-result.dto.js';
import { ResistanceRollResult } from '../../domain/value-objects/resistance-roll-result.js';
import type { AuthenticatedUser } from '../../../shared/interfaces/http/authenticated-request.js';
import { CurrentUser } from '../../../shared/interfaces/http/current-user.decorator.js';
import { ApiErrors } from '../../../shared/interfaces/http/api-errors.decorator.js';

@UseGuards(JwtAuthGuard)
@Controller('v1/resistance-rolls')
@ApiTags('Resistance rolls')
export class ResistanceRollController {
  constructor(private queryBus: QueryBus) {}

  @Post()
  @ApiOperation({ operationId: 'resistanceRoll', summary: 'Get resistance roll result' })
  @ApiOkResponse({ type: ResistanceRollResultDto, description: 'Success' })
  @ApiErrors()
  async resistanceRoll(@Body() dto: ResistanceRollQueryDto, @CurrentUser() user: AuthenticatedUser): Promise<ResistanceRollResultDto> {
    const userId = user.id;
    const roles = user.roles;
    const query = ResistanceRollQueryDto.toQuery(dto, userId, roles);
    const result = await this.queryBus.execute<ResistanceRollQuery, ResistanceRollResult>(query);
    return ResistanceRollResultDto.fromEntity(result);
  }
}
