import { Controller, Get, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiExtraModels, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../shared/infrastructure/security/jwt-auth.guard.js';
import { GetFightingStylesQuery } from '../../application/cqrs/queries/get-fighting-styles.query.js';
import type { FightingStyleCatalog } from '../../domain/value-objects/fighting-styles.vo.js';
import { FightingStylesDto, StyleConditionDto } from './dto/fighting-styles.dto.js';
import type { AuthenticatedUser } from '../../../shared/interfaces/http/authenticated-request.js';
import { CurrentUser } from '../../../shared/interfaces/http/current-user.decorator.js';
import { ApiErrors } from '../../../shared/interfaces/http/api-errors.decorator.js';

@UseGuards(JwtAuthGuard)
@Controller('v1/fighting-styles')
@ApiTags('Fighting styles')
@ApiExtraModels(StyleConditionDto)
export class FightingStylesController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('')
  @ApiOperation({
    operationId: 'getFightingStyles',
    summary: 'Get the fighting styles',
    description: 'Fighting styles with their abilities, rank costs and requirements. Requires Core Law access.',
  })
  @ApiOkResponse({ type: FightingStylesDto, description: 'Success' })
  @ApiErrors({ 403: 'The user has no Core Law access', 404: 'The fighting styles have not been imported' })
  async getFightingStyles(@CurrentUser() user: AuthenticatedUser): Promise<FightingStylesDto> {
    const query = new GetFightingStylesQuery(user.id, user.roles);
    const catalog = await this.queryBus.execute<GetFightingStylesQuery, FightingStyleCatalog>(query);
    return FightingStylesDto.fromEntity(catalog);
  }
}
