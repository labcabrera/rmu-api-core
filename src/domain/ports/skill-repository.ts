import { Page } from '@domain/entities/page';
import { Skill } from '@domain/entities/skill';
import { SkillQuery } from '@domain/queries/skill-query';

export interface SkillRepository {

  findById(id: string): Promise<Skill | null>;
  find(query: SkillQuery, page: number, size: number): Promise<Page<Skill>>;

}
