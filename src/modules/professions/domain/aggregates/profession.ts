import type { ProfessionSkillCosts } from '../value-objects/profession-skill-cost.vo.js';
import type { RealmType } from '../value-objects/realm-type.vo.js';
import type { ProfessionProps } from './profession-props.js';
import type { RbacEntity } from '../../../shared/domain/entities/rbac-entity.js';
import type { ProfessionArchetype } from '../value-objects/profession-archetype.vo.js';
import type { EntitySource } from '../../../shared/domain/entities/entity-source.js';
import type { AccessType } from '../../../shared/domain/entities/access-type.js';
import { BaseAggregateRoot } from '../../../shared/domain/aggregates/base-aggregate.js';

export class Profession extends BaseAggregateRoot<ProfessionProps> implements RbacEntity {
  constructor(
    id: string,
    public archetype: ProfessionArchetype,
    public availableRealmTypes: RealmType[],
    public fixedRealmTypes: RealmType[],
    public skillCosts: ProfessionSkillCosts,
    public professionalSkills: string[],
    public entitySource: EntitySource,
    public description: string | undefined,
    public imageUrl: string | undefined,
    public owner: string,
    public accessType: AccessType,
    public createdAt: Date,
    public updatedAt?: Date,
  ) {
    super(id);
  }

  static create(props: Omit<ProfessionProps, 'createdAt' | 'updatedAt'>): Profession {
    const profession = new Profession(
      props.id,
      props.archetype,
      props.availableRealmTypes,
      props.fixedRealmTypes,
      props.skillCosts,
      props.professionalSkills,
      props.entitySource,
      props.description,
      props.imageUrl,
      props.owner,
      props.accessType,
      new Date(),
      undefined,
    );
    return profession;
  }

  update(props: Partial<Omit<ProfessionProps, 'id' | 'owner' | 'createdAt' | 'updatedAt'>>) {
    if (props.archetype) this.archetype = props.archetype;
    if (props.availableRealmTypes) this.availableRealmTypes = props.availableRealmTypes;
    if (props.fixedRealmTypes) this.fixedRealmTypes = props.fixedRealmTypes;
    if (props.skillCosts) this.skillCosts = props.skillCosts;
    if (props.professionalSkills) this.professionalSkills = props.professionalSkills;
    if (props.availableRealmTypes) this.availableRealmTypes = props.availableRealmTypes;
    if (props.entitySource) this.entitySource = props.entitySource;
    if (props.description !== undefined) this.description = props.description;
    if (props.imageUrl !== undefined) this.imageUrl = props.imageUrl;
    if (props.accessType) this.accessType = props.accessType;
    this.updatedAt = new Date();
  }

  static fromProps(props: ProfessionProps): Profession {
    return new Profession(
      props.id,
      props.archetype,
      props.availableRealmTypes,
      props.fixedRealmTypes,
      props.skillCosts,
      props.professionalSkills,
      props.entitySource,
      props.description,
      props.imageUrl,
      props.owner,
      props.accessType,
      props.createdAt,
      props.updatedAt,
    );
  }

  getProps(): ProfessionProps {
    return {
      id: this.id,
      archetype: this.archetype,
      availableRealmTypes: this.availableRealmTypes,
      fixedRealmTypes: this.fixedRealmTypes,
      skillCosts: this.skillCosts,
      professionalSkills: this.professionalSkills,
      entitySource: this.entitySource,
      description: this.description,
      imageUrl: this.imageUrl,
      owner: this.owner,
      accessType: this.accessType,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
