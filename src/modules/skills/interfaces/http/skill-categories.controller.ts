import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt.auth.guard';
import { SkillCategoryDto } from './dto/skill-category.dto';
import type { SkillCategoryRepository } from '../../application/ports/skill-category-repository';
import { Page } from 'src/modules/shared/domain/entities/page';

@UseGuards(JwtAuthGuard)
@Controller('v1/skill-categories')
@ApiTags('Skill Categories')
export class SkillCategoryController {
  constructor(@Inject('SkillCategoryRepository') private readonly skillCategoryRepository: SkillCategoryRepository) {}

  @Get(':id')
  @ApiOkResponse({ type: SkillCategoryDto })
  @ApiOperation({ operationId: 'findSkillCategoryById', summary: 'Find skill category by id' })
  async findById(@Param('id') id: string) {
    const entity = await this.skillCategoryRepository.findById(id);
    if (!entity) {
      throw new Error(`Skill category with id ${id} not found`);
    }
    return SkillCategoryDto.fromEntity(entity);
  }

  @Get('')
  @ApiOkResponse({ type: [SkillCategoryDto] })
  @ApiOperation({ operationId: 'findSkillCategories', summary: 'Find all skill categories' })
  async find() {
    //TODO cqrs
    //const page = await this.queryBus.execute<GetRacesQuery, Page<Race>>(query);
    const page = await this.skillCategoryRepository.findByRsql(undefined, 0, 100);
    const mapped = page.content.map((category) => SkillCategoryDto.fromEntity(category));
    return new Page<SkillCategoryDto>(mapped, page.pagination.page, page.pagination.size, page.pagination.totalElements);
  }
}
