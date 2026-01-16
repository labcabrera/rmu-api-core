import { Injectable } from '@nestjs/common';
import { Page } from 'src/modules/shared/domain/entities/page';
import { SkillRepository } from 'src/modules/skills/application/ports/skill-repository';
import { Skill, RMU_SKILLS } from 'src/modules/skills/domain/aggregates/skill';

@Injectable()
export class InMemorySkillRepository implements SkillRepository {
  findById(id: string): Skill | null {
    const skill = RMU_SKILLS.find((skill) => skill.id === id);
    return skill || null;
  }
  findAll(): Skill[] {
    return RMU_SKILLS;
  }

  findByCategory(categoryId: string): Skill[] {
    const filteredSkills = RMU_SKILLS.filter((skill) => {
      if (categoryId && skill.categoryId !== categoryId) {
        return false;
      }
      return true;
    });
    return filteredSkills;
  }
  find(rsql: string | undefined, page: number, size: number): Page<Skill> {
    const idEquals = rsql?.match(/id==([^;]+)/)?.[1];
    const idRe = rsql?.match(/id=re=([^;]+)/)?.[1];
    const categoryId = rsql?.match(/categoryId==([^;]+)/)?.[1];
    const filteredSkills = RMU_SKILLS.filter((skill) => {
      if (idEquals && skill.id !== idEquals) {
        return false;
      }
      if (idRe && !skill.id.includes(idRe)) {
        return false;
      }
      if (categoryId && skill.categoryId !== categoryId) {
        return false;
      }
      return true;
    });
    return {
      content: filteredSkills.slice(page * size, page * size + size),
      pagination: {
        page: page,
        size: size,
        totalElements: filteredSkills.length,
        totalPages: Math.ceil(filteredSkills.length / size),
      },
    };
  }
}
