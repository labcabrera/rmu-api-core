import { BaseAggregateRoot } from 'src/modules/shared/domain/aggregates/base-aggregate';
import { AccessType } from 'src/modules/shared/domain/entities/access-type';
import { SkillProps } from './skill-props';
import { EnumerationCategory } from 'src/modules/enumerations/domain/value-objects/enumeration-category.vo';
import { NotModifiedError } from 'src/modules/shared/domain/errors/errors';

export class Skill extends BaseAggregateRoot<SkillProps> {
  private constructor(
    id: string,
    public categoryId: string,
    public bonus: string[],
    public specialization: EnumerationCategory | null,
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

  update(props: Partial<Omit<SkillProps, 'id' | 'owner' | 'createdAt' | 'updatedAt'>>) {
    let modified = false;
    if (props.categoryId) {
      modified = props.categoryId !== this.categoryId;
      this.categoryId = props.categoryId;
    }
    if (props.bonus) {
      modified = modified || props.bonus !== this.bonus;
      this.bonus = props.bonus;
    }
    if (props.specialization) {
      modified = modified || props.specialization !== this.specialization;
      this.specialization = props.specialization;
    }
    if (props.accessType) {
      modified = modified || props.accessType !== this.accessType;
      this.accessType = props.accessType;
    }
    this.updatedAt = new Date();
    if (!modified) {
      throw new NotModifiedError('Skill not modified');
    }
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
