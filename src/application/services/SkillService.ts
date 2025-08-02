// Legacy constants that can be migrated to TypeScript later
import { skills } from '@shared/constants/skills';
import { PaginationOptions, PaginatedResult, NotFoundError } from '@shared/types';
import { Skill } from '@domain/entities/Game';

export class SkillService {
  findById(id: string): Skill {
    const skill = skills.find(s => s.id === id);
    if (!skill) {
      throw new NotFoundError('Skill', id);
    }
    return skill;
  }

  findAll(options: PaginationOptions): PaginatedResult<Skill> {
    const skip = options.page * options.size;
    const content = skills.slice(skip, skip + options.size);

    return {
      content,
      pagination: {
        page: options.page,
        size: options.size,
        totalElements: skills.length,
      },
    };
  }

  findByCategory(categoryId: string): Skill[] {
    return skills.filter(skill => skill.category === categoryId);
  }
}
