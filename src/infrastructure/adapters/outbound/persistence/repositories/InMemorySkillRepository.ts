import { injectable } from 'inversify';
import { SkillRepository } from '@domain/ports/skill-repository';
import { Skill } from '@domain/entities/Skill';
import { RMU_SKILLS } from '@shared/constants/rmu-skills';

@injectable()
export class InMemorySkillRepository implements SkillRepository {
  private skills: Skill[] = [...RMU_SKILLS];

  async findById(id: string): Promise<Skill | null> {
    const skill = this.skills.find(skill => skill.id === id);
    return skill || null;
  }

  async findAll(): Promise<Skill[]> {
    return [...this.skills];
  }

  async findAllPaginated(page: number, size: number): Promise<{ content: Skill[]; totalElements: number }> {
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const content = this.skills.slice(startIndex, endIndex);
    
    return {
      content,
      totalElements: this.skills.length
    };
  }

  async create(skill: Skill): Promise<Skill> {
    // Check if skill already exists
    const existingIndex = this.skills.findIndex(s => s.id === skill.id);
    if (existingIndex !== -1) {
      throw new Error(`Skill with id ${skill.id} already exists`);
    }

    this.skills.push(skill);
    return skill;
  }

  async update(id: string, skillUpdate: Partial<Skill>): Promise<Skill | null> {
    const index = this.skills.findIndex(skill => skill.id === id);
    if (index === -1) {
      return null;
    }

    this.skills[index] = { ...this.skills[index], ...skillUpdate };
    return this.skills[index];
  }

  async deleteById(id: string): Promise<boolean> {
    const index = this.skills.findIndex(skill => skill.id === id);
    if (index === -1) {
      return false;
    }

    this.skills.splice(index, 1);
    return true;
  }
}
