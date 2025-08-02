import { Skill, SkillCategory, CharacterSize, ArmorType } from '@domain/entities/Game';
import { PaginationOptions, PaginatedResult } from '@shared/types';

export interface SkillRepository {
  findById(id: string): Promise<Skill | null>;
  findAll(options: PaginationOptions): Promise<PaginatedResult<Skill>>;
  findByCategory(categoryId: string): Promise<Skill[]>;
}

export interface SkillCategoryRepository {
  findById(id: string): Promise<SkillCategory | null>;
  findAll(options: PaginationOptions): Promise<PaginatedResult<SkillCategory>>;
}

export interface CharacterSizeRepository {
  findById(id: string): Promise<CharacterSize | null>;
  findAll(options: PaginationOptions): Promise<PaginatedResult<CharacterSize>>;
}

export interface ArmorTypeRepository {
  findById(id: string): Promise<ArmorType | null>;
  findAll(options: PaginationOptions): Promise<PaginatedResult<ArmorType>>;
}
