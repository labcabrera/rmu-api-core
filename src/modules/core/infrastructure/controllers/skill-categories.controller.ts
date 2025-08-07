import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
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
  findById(@Param('id') id: string) {
    return this.skillCategoryRepository.findById(id);
  }

  @Get('')
  find() {
    return this.skillCategoryRepository.find();
  }
}
