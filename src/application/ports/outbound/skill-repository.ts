import { Page } from '@domain/entities/page';
import { Skill } from '@domain/entities/skill';

export interface SkillRepository {
  findById(id: string): Promise<Skill | null>;
  find(categoryId: string | undefined, page: number, size: number): Promise<Page<Skill>>;
}
