import { Skill } from 'src/modules/core/domain/entities/skill';
import { Page } from '../../domain/entities/page';

export interface SkillRepository {
  findById(id: string): Skill | null;

  findAll(): Skill[];

  find(rsql: string | undefined, page: number, size: number): Page<Skill>;

  findByCategory(categoryId: string): Skill[];
}
