import { Inject, Injectable } from '@nestjs/common';
import type { SkillRepository } from 'src/modules/skills/application/ports/skill-repository';
import { Culture } from 'src/modules/cultures/domain/aggregates/culture';
import { cultureDevelopmentCost } from 'src/modules/cultures/domain/services/culture-development-cost';
import { CultureView } from '../read-models/culture-view';

/** Builds the culture read model, resolving skill categories from the skill catalog to cost the ranks. */
@Injectable()
export class CultureViewService {
  constructor(@Inject('SkillRepository') private readonly skillRepository: SkillRepository) {}

  async toView(culture: Culture): Promise<CultureView> {
    const [view] = await this.toViews([culture]);
    return view;
  }

  async toViews(cultures: Culture[]): Promise<CultureView[]> {
    const categories = await this.resolveCategories(cultures);
    return cultures.map(culture => ({
      culture,
      developmentCost: cultureDevelopmentCost(culture.skillRanks, skillId => categories.get(skillId)),
    }));
  }

  /** Skill id to category id. Skills that are not in the catalog are left out and get the default cost. */
  private async resolveCategories(cultures: Culture[]): Promise<Map<string, string>> {
    const skillIds = new Set<string>();
    for (const culture of cultures) {
      for (const entry of culture.skillRanks) {
        if (entry.skillId) skillIds.add(entry.skillId);
        entry.skillIds?.forEach(skillId => skillIds.add(skillId));
      }
    }
    const skills = await Promise.all([...skillIds].map(skillId => this.skillRepository.findById(skillId)));
    const categories = new Map<string, string>();
    for (const skill of skills) {
      if (skill) categories.set(skill.id, skill.categoryId);
    }
    return categories;
  }
}
