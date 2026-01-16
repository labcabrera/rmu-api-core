import { Controller, Get, Inject, Param, Query, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt.auth.guard';
import { SkillDto, SkillPageDto } from './dto/skill.dto';
import { NotFoundError } from '../../../core/domain/errors/errors';
import type { SkillRepository } from '../../application/ports/skill-repository';
import { PagedQueryDto } from '../../../core/interfaces/http/dto/paged-rsql-query';

@UseGuards(JwtAuthGuard)
@Controller('v1/skills')
@ApiTags('Skills')
export class SkillController {
  constructor(@Inject('SkillRepository') private readonly skillRepository: SkillRepository) {}

  @Get(':id')
  @ApiOperation({ operationId: 'findSkillById', summary: 'Find skill by id' })
  @ApiOkResponse({ type: SkillDto })
  findById(@Param('id') id: string) {
    const skill = this.skillRepository.findById(id);
    if (!skill) {
      throw new NotFoundError('Skill', id);
    }
    return SkillDto.fromEntity(skill);
  }

  @Get('')
  @ApiOperation({ operationId: 'findAllSkills', summary: 'Find all skills' })
  @ApiOkResponse({ type: [SkillDto] })
  find(@Query() dto: PagedQueryDto): SkillPageDto {
    const page = this.skillRepository.find(dto.q, dto.page, dto.size);
    return {
      content: page.content.map((e) => SkillDto.fromEntity(e)),
      pagination: {
        page: dto.page ?? 0,
        size: dto.size ?? page.content.length,
        totalElements: page.pagination.totalElements,
        totalPages: page.pagination.totalPages,
      },
    };
  }

  @Get('/categories/:categoryId')
  @ApiOperation({ operationId: 'findAllSkillsByCategory', summary: 'Find all skills by category' })
  @ApiOkResponse({ type: [SkillDto] })
  findByCategory(@Param('categoryId') categoryId: string) {
    const list = this.skillRepository.findByCategory(categoryId);
    return list.map((e) => SkillDto.fromEntity(e));
  }
}
