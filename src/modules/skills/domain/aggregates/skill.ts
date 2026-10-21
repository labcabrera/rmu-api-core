import { BaseAggregateRoot } from '../../../shared/domain/aggregates/base-aggregate.js';
import type { AccessType } from '../../../shared/domain/entities/access-type.js';
import type { SkillProps } from './skill-props.js';
import type { EnumerationCategory } from '../../../enumerations/domain/value-objects/enumeration-category.vo.js';
import { NotModifiedError } from '../../../shared/domain/errors/errors.js';
import { type ManeuverProfile, ManeuverProfiles } from '../../../skill-categories/domain/value-objects/maneuver-profile.vo.js';

export type SkillUpdateProps = Partial<Omit<SkillProps, 'id' | 'owner' | 'createdAt' | 'updatedAt' | 'maneuver'>> & {
  /** undefined keeps the current profile, null removes it. */
  maneuver?: ManeuverProfile | null;
};

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
    public maneuver?: ManeuverProfile,
  ) {
    super(id);
  }

  static create(props: Omit<SkillProps, 'createdAt' | 'updatedAt'>) {
    ManeuverProfiles.validate(props.maneuver);
    return new Skill(
      props.id,
      props.categoryId,
      props.bonus,
      props.specialization,
      props.owner,
      props.accessType,
      new Date(),
      undefined,
      ManeuverProfiles.normalize(props.maneuver),
    );
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
      ManeuverProfiles.normalize(props.maneuver),
    );
  }

  update(props: SkillUpdateProps) {
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
    if (props.maneuver !== undefined) {
      ManeuverProfiles.validate(props.maneuver);
      const maneuver = ManeuverProfiles.normalize(props.maneuver);
      modified = modified || JSON.stringify(maneuver) !== JSON.stringify(this.maneuver);
      this.maneuver = maneuver;
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
      maneuver: this.maneuver,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
