import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common';

import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt.auth.guard';
import * as skillCategoryRepository from '../../application/ports/outbound/skill-category-repository';

@UseGuards(JwtAuthGuard)
@Controller('v1/skill-categories')
@ApiTags('Skill Categories')
export class SkillCategoryController {
  constructor(
    @Inject('SkillCategoryRepository') private readonly skillCategoryRepository: skillCategoryRepository.SkillCategoryRepository,
  ) {}

  @Get(':id')
  @ApiOperation({ operationId: 'findSkillCategoryById', summary: 'Find skill category by id' })
  findById(@Param('id') id: string) {
    return this.skillCategoryRepository.findById(id);
  }

  @Get('')
  @ApiOperation({ operationId: 'findSkillCategories', summary: 'Find all skill categories' })
  find() {
    return this.skillCategoryRepository.find();
  }
}
