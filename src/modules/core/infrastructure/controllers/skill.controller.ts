import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt.auth.guard';
import * as skillRepository from '../../application/ports/outbound/skill-repository';

@UseGuards(JwtAuthGuard)
@Controller('v1/skills')
@ApiTags('Skills')
export class SkillController {
  constructor(@Inject('SkillRepository') private readonly skillRepository: skillRepository.SkillRepository) {}

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.skillRepository.findById(id);
  }

  @Get('')
  find() {
    return this.skillRepository.findAll();
  }

  @Get('/category/:categoryId')
  findByCategory(@Param('categoryId') categoryId: string) {
    return this.skillRepository.findByCategory(categoryId);
  }
}
