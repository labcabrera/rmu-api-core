import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../shared/infrastructure/security/jwt-auth.guard.js';
import type { AuthenticatedUser } from '../../../shared/interfaces/http/authenticated-request.js';
import { CurrentUser } from '../../../shared/interfaces/http/current-user.decorator.js';
import { ApiErrors } from '../../../shared/interfaces/http/api-errors.decorator.js';
import { GetSkillDifficultiesQuery } from '../../application/cqrs/queries/get-skill-difficulties.query.js';
import { GetSkillDifficultyQuery } from '../../application/cqrs/queries/get-skill-difficulty.query.js';
import type { SkillDifficultyGuide } from '../../domain/value-objects/skill-difficulty-guide.vo.js';
import { SkillDifficultyGuideDto } from './dto/skill-difficulty-guide.dto.js';

@UseGuards(JwtAuthGuard)
@Controller('v1/skill-difficulties')
@ApiTags('Skill difficulties')
export class SkillDifficultyController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('')
  @ApiOperation({
    operationId: 'getSkillDifficulties',
    summary: 'Get every difficulty guide',
    description: 'The example difficulties of every skill and the general scale (skillId general). Requires Core Law access.',
  })
  @ApiOkResponse({ type: [SkillDifficultyGuideDto], description: 'Success' })
  @ApiErrors({ 403: 'The user has no Core Law access' })
  async findAll(@CurrentUser() user: AuthenticatedUser): Promise<SkillDifficultyGuideDto[]> {
    const query = new GetSkillDifficultiesQuery(user.id, user.roles);
    const guides = await this.queryBus.execute<GetSkillDifficultiesQuery, SkillDifficultyGuide[]>(query);
    return guides.map(guide => SkillDifficultyGuideDto.fromEntity(guide));
  }

  @Get(':skillId')
  @ApiOperation({
    operationId: 'getSkillDifficulty',
    summary: 'Get the difficulty guide of a skill',
    description:
      'The example difficulties of the skill. A skill without examples gets the general scale with fallback true. Requires Core Law access.',
  })
  @ApiOkResponse({ type: SkillDifficultyGuideDto, description: 'Success' })
  @ApiErrors({ 403: 'The user has no Core Law access', 404: 'The guides have not been imported' })
  async findBySkill(@Param('skillId') skillId: string, @CurrentUser() user: AuthenticatedUser): Promise<SkillDifficultyGuideDto> {
    const query = new GetSkillDifficultyQuery(skillId, user.id, user.roles);
    const guide = await this.queryBus.execute<GetSkillDifficultyQuery, SkillDifficultyGuide>(query);
    return SkillDifficultyGuideDto.fromEntity(guide);
  }
}
