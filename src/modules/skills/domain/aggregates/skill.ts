import { BaseAggregateRoot } from 'src/modules/shared/domain/aggregates/base-aggregate';
import { SkillSpecialization } from '../value-objects/skill-specialization.vo';
import { AccessType } from 'src/modules/shared/domain/entities/access-type';
import { SkillProps } from './skill-props';

export class Skill extends BaseAggregateRoot<SkillProps> {
  private constructor(
    id: string,
    public categoryId: string,
    public bonus: string[],
    public specialization: SkillSpecialization | null,
    public owner: string,
    public accessType: AccessType,
    public createdAt: Date,
    public updatedAt?: Date,
  ) {
    super(id);
  }

  static create(props: Omit<SkillProps, 'createdAt' | 'updatedAt'>) {
    return new Skill(props.id, props.categoryId, props.bonus, props.specialization, props.owner, props.accessType, new Date(), undefined);
  }

  static fromProps(props: SkillProps) {
    return new Skill(
      props.id,
      props.categoryId,
      props.bonus,
      props.specialization,
      props.owner,
      props.accessType,
      props.createdAt,
      props.updatedAt,
    );
  }

  public getProps(): SkillProps {
    return {
      id: this.id,
      categoryId: this.categoryId,
      bonus: this.bonus,
      specialization: this.specialization,
      owner: this.owner,
      accessType: this.accessType,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
