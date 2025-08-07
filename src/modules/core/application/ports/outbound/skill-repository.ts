import { Page } from 'src/modules/core/domain/entities/page';
import { Skill } from 'src/modules/core/domain/entities/skill';

export interface SkillRepository {
  findById(id: string): Skill | null;
  find(categoryId: string | undefined, page: number, size: number): Page<Skill>;
}
