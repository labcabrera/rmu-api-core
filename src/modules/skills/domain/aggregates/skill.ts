import { BaseAggregateRoot } from '../../../shared/domain/aggregates/base-aggregate.js';
import type { SkillProps } from './skill-props.js';
import { type ManeuverProfile, ManeuverProfiles } from '../../../skill-categories/domain/value-objects/maneuver-profile.vo.js';

export type SkillUpdateProps = Partial<Omit<SkillProps, 'id' | 'owner' | 'createdAt' | 'updatedAt' | 'maneuver'>> & {
  /** undefined keeps the current profile, null removes it. */
  maneuver?: ManeuverProfile | null;
};

export class Skill extends BaseAggregateRoot<SkillProps> {
  private constructor(props: SkillProps) {
    super(props);
  }

  get categoryId() {
    return this.props.categoryId;
  }

  get bonus() {
    return this.props.bonus;
  }

  get specialization() {
    return this.props.specialization;
  }

  get owner() {
    return this.props.owner;
  }

  get accessType() {
    return this.props.accessType;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get maneuver() {
    return this.props.maneuver;
  }

  static create(props: Omit<SkillProps, 'createdAt' | 'updatedAt'>) {
    ManeuverProfiles.validate(props.maneuver);
    return new Skill({ ...props, createdAt: new Date(), updatedAt: undefined, maneuver: ManeuverProfiles.normalize(props.maneuver) });
  }

  static fromProps(props: SkillProps) {
    return new Skill({ ...props, maneuver: ManeuverProfiles.normalize(props.maneuver) });
  }

  /** Applies the given fields; the handler asks hasChanges() whether they changed the state (spec 021). */
  update(props: SkillUpdateProps): void {
    if (props.categoryId) {
      this.props.categoryId = props.categoryId;
    }
    if (props.bonus) {
      this.props.bonus = props.bonus;
    }
    if (props.specialization) {
      this.props.specialization = props.specialization;
    }
    if (props.accessType) {
      this.props.accessType = props.accessType;
    }
    if (props.maneuver !== undefined) {
      ManeuverProfiles.validate(props.maneuver);
      const maneuver = ManeuverProfiles.normalize(props.maneuver);
      this.props.maneuver = maneuver;
    }
    // A change without effect keeps the stored updatedAt: the handler neither writes nor publishes it.
    if (this.hasChanges()) this.props.updatedAt = new Date();
  }
}
