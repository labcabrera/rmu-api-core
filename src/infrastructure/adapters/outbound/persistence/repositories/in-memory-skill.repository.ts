import { injectable } from 'inversify';
import { SkillRepository } from '@domain/ports/outbound/skill-repository';
import { RMU_SKILLS, Skill } from '@domain/entities/skill';
import { Page } from '@domain/entities/page';

@injectable()
export class InMemorySkillRepository implements SkillRepository {
  async findById(id: string): Promise<Skill | null> {
    const skill = RMU_SKILLS.find(skill => skill.id === id);
    return skill || null;
  }

  async find(categoryId: string | undefined, page: number, size: number): Promise<Page<Skill>> {
    const filteredSkills = RMU_SKILLS.filter(skill => {
      if (categoryId && skill.categoryId !== categoryId) {
        return false;
      }
      return true;
    });
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const content = filteredSkills.slice(startIndex, endIndex);
    return {
      content,
      pagination: {
        page,
        size,
        totalElements: filteredSkills.length,
        totalPages: Math.ceil(filteredSkills.length / size),
      },
    };
  }
}
