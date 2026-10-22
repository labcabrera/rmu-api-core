import { Inject, Injectable } from '@nestjs/common';
import {
  SKILL_CATEGORY_REPOSITORY,
  type SkillCategoryRepository,
} from '../../../skill-categories/application/ports/skill-category-repository.port.js';
import { ManeuverProfiles } from '../../../skill-categories/domain/value-objects/maneuver-profile.vo.js';
import { Skill } from '../../domain/aggregates/skill.js';
import type { SkillView } from '../read-models/skill-view.js';

@Injectable()
export class SkillViewService {
  constructor(@Inject(SKILL_CATEGORY_REPOSITORY) private readonly skillCategoryRepository: SkillCategoryRepository) {}

  async toView(skill: Skill): Promise<SkillView> {
    const [view] = await this.toViews([skill]);
    return view;
  }

  async toViews(skills: Skill[]): Promise<SkillView[]> {
    const categoryIds = [...new Set(skills.map(skill => skill.categoryId))];
    const categories = await this.skillCategoryRepository.findByIds(categoryIds);
    const byId = new Map(categories.map(category => [category.id, category]));
    return skills.map(skill => ({
      skill,
      maneuver: ManeuverProfiles.resolve(byId.get(skill.categoryId)?.maneuver, skill.maneuver),
    }));
  }
}
