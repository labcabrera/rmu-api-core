import { Inject, Injectable } from '@nestjs/common';
import type { SkillCategoryRepository } from 'src/modules/realms/application/ports/skill-category-repository';
import { ManeuverProfiles } from 'src/modules/skill-categories/domain/value-objects/maneuver-profile.vo';
import { Skill } from '../../domain/aggregates/skill';
import { SkillView } from '../read-models/skill-view';

@Injectable()
export class SkillViewService {
  constructor(@Inject('SkillCategoryRepository') private readonly skillCategoryRepository: SkillCategoryRepository) {}

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
