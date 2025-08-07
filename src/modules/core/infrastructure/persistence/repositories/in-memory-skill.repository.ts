import { Injectable } from '@nestjs/common';
import { SkillRepository } from 'src/modules/core/application/ports/outbound/skill-repository';
import { Page } from 'src/modules/core/domain/entities/page';
import { Skill, RMU_SKILLS } from 'src/modules/core/domain/entities/skill';

@Injectable()
export class InMemorySkillRepository implements SkillRepository {
  findById(id: string): Skill | null {
    const skill = RMU_SKILLS.find((skill) => skill.id === id);
    return skill || null;
  }

  find(categoryId: string | undefined, page: number, size: number): Page<Skill> {
    const filteredSkills = RMU_SKILLS.filter((skill) => {
      if (categoryId && skill.categoryId !== categoryId) {
        return false;
      }
      return true;
    });
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const content = filteredSkills.slice(startIndex, endIndex);
    return new Page<Skill>(content, page, size, filteredSkills.length);
  }
}
