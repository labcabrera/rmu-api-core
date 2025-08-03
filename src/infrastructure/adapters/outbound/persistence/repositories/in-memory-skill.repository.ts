import { injectable } from 'inversify';
import { SkillRepository } from '@domain/ports/skill-repository';
import { Skill } from '@domain/entities/skill';
import { RMU_SKILLS } from '@shared/constants/skills';
import { Page } from '@domain/entities/page';
import { SkillQuery } from '@domain/queries/skill-query';

@injectable()
export class InMemorySkillRepository implements SkillRepository {
  private skills: Skill[] = [...RMU_SKILLS];

  async findById(id: string): Promise<Skill | null> {
    const skill = this.skills.find(skill => skill.id === id);
    return skill || null;
  }

  async find(query: SkillQuery, page: number, size: number): Promise<Page<Skill>> {
    const filteredSkills = this.skills.filter(skill => {
      if(query.id && skill.id !== query.id) {
        return false;
      }
      if (query.categoryId && skill.categoryId !== query.categoryId) {
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
        totalPages: Math.ceil(filteredSkills.length / size)
      }
    };
  }
}
