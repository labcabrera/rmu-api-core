import { AggregateRoot } from '@nestjs/cqrs';
import { ProfessionSkillCosts } from '../value-objects/profession-skill-cost.vo';
import { DomainEvent } from 'src/modules/shared/domain/events/domain-event';

export interface ProfessionProps {
  id: string;
  skillCosts: ProfessionSkillCosts;
  professionalSkills: string[];
  description: string | undefined;
  owner: string;
  createdAt: Date;
  updatedAt?: Date;
}

export class Profession extends AggregateRoot<DomainEvent<ProfessionProps>> {
  constructor(
    public readonly id: string,
    public skillCosts: ProfessionSkillCosts,
    public professionalSkills: string[],
    public description: string | undefined,
    public owner: string,
    public createdAt: Date,
    public updatedAt?: Date,
  ) {
    super();
  }

  static create(props: Omit<ProfessionProps, 'createdAt' | 'updatedAt'>): Profession {
    const profession = new Profession(
      props.id,
      props.skillCosts,
      props.professionalSkills,
      props.description,
      props.owner,
      new Date(),
      undefined,
    );
    //TODO apply event
    return profession;
  }

  update(props: Partial<Omit<ProfessionProps, 'id' | 'owner' | 'createdAt' | 'updatedAt'>>) {
    if (props.skillCosts) {
      this.skillCosts = props.skillCosts;
    }
    if (props.professionalSkills) {
      this.professionalSkills = props.professionalSkills;
    }
    this.updatedAt = new Date();
    //TODO apply event
  }

  static fromProps(props: ProfessionProps): Profession {
    return new Profession(
      props.id,
      props.skillCosts,
      props.professionalSkills,
      props.description,
      props.owner,
      props.createdAt,
      props.updatedAt,
    );
  }

  toProps(): ProfessionProps {
    return {
      id: this.id,
      skillCosts: this.skillCosts,
      professionalSkills: this.professionalSkills,
      description: this.description,
      owner: this.owner,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
