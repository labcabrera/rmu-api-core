import { Skill } from '@domain/entities/Skill';

export interface SkillRepository {
  findById(id: string): Promise<Skill | null>;
  findAll(): Promise<Skill[]>;
  findAllPaginated(page: number, size: number): Promise<{ content: Skill[]; totalElements: number }>;
  create(skill: Skill): Promise<Skill>;
  update(id: string, skill: Partial<Skill>): Promise<Skill | null>;
  deleteById(id: string): Promise<boolean>;
}
