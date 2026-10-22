import type { ProfessionProps } from './profession-props.js';
import type { RbacEntity } from '../../../shared/domain/entities/rbac-entity.js';
import { BaseAggregateRoot } from '../../../shared/domain/aggregates/base-aggregate.js';

export class Profession extends BaseAggregateRoot<ProfessionProps> implements RbacEntity {
  private constructor(props: ProfessionProps) {
    super(props);
  }

  get archetype() {
    return this.props.archetype;
  }

  get availableRealmTypes() {
    return this.props.availableRealmTypes;
  }

  get fixedRealmTypes() {
    return this.props.fixedRealmTypes;
  }

  get skillCosts() {
    return this.props.skillCosts;
  }

  get professionalSkills() {
    return this.props.professionalSkills;
  }

  get entitySource() {
    return this.props.entitySource;
  }

  get description() {
    return this.props.description;
  }

  get imageUrl() {
    return this.props.imageUrl;
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

  static create(props: Omit<ProfessionProps, 'createdAt' | 'updatedAt'>): Profession {
    const profession = new Profession({ ...props, createdAt: new Date(), updatedAt: undefined });
    return profession;
  }

  update(props: Partial<Omit<ProfessionProps, 'id' | 'owner' | 'createdAt' | 'updatedAt'>>) {
    if (props.archetype) this.props.archetype = props.archetype;
    if (props.availableRealmTypes) this.props.availableRealmTypes = props.availableRealmTypes;
    if (props.fixedRealmTypes) this.props.fixedRealmTypes = props.fixedRealmTypes;
    if (props.skillCosts) this.props.skillCosts = props.skillCosts;
    if (props.professionalSkills) this.props.professionalSkills = props.professionalSkills;
    if (props.availableRealmTypes) this.props.availableRealmTypes = props.availableRealmTypes;
    if (props.entitySource) this.props.entitySource = props.entitySource;
    if (props.description !== undefined) this.props.description = props.description;
    if (props.imageUrl !== undefined) this.props.imageUrl = props.imageUrl;
    if (props.accessType) this.props.accessType = props.accessType;
    this.props.updatedAt = new Date();
  }

  static fromProps(props: ProfessionProps): Profession {
    return new Profession({ ...props });
  }
}
