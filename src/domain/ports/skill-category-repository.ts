import { SkillCategory } from '@domain/entities/SkillCategory';

export interface SkillCategoryRepository {
  findById(id: string): Promise<SkillCategory | null>;
  findAll(): Promise<SkillCategory[]>;
  findAllPaginated(page: number, size: number): Promise<{ content: SkillCategory[]; totalElements: number }>;
}
