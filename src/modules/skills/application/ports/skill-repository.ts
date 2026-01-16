import { Page } from 'src/modules/shared/domain/entities/page';
import { Skill } from 'src/modules/skills/domain/aggregates/skill';

export interface SkillRepository {
  findById(id: string): Skill | null;

  findAll(): Skill[];

  find(rsql: string | undefined, page: number, size: number): Page<Skill>;

  findByCategory(categoryId: string): Skill[];
}
