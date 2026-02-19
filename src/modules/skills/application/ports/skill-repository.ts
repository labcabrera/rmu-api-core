import { Page } from 'src/modules/shared/domain/entities/page';
import { Skill } from 'src/modules/skills/domain/aggregates/skill';

export interface SkillRepository {
  findById(id: string): Promise<Skill | null>;

  findByRsql(rsql: string | undefined, page: number, size: number): Promise<Page<Skill>>;

  save(entity: Skill): Promise<Skill>;
}
