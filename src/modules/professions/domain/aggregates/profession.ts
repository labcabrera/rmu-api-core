import { AggregateRoot } from '@nestjs/cqrs';
import { ProfessionSkillCosts } from '../value-objects/profession-skill-cost.vo';
import { RealmType } from '../value-objects/realm-type.vo';
import { DomainEvent } from 'src/modules/shared/domain/events/domain-event';
import { ProfessionProps } from './profession.props';
import { HasOwner } from 'src/modules/shared/domain/entities/has-owner';
import { ProfessionArchetype } from '../value-objects/profession-archetype.vo';
import { EntitySource } from 'src/modules/shared/domain/entities/entity-source';

export class Profession extends AggregateRoot<DomainEvent<ProfessionProps>> implements HasOwner {
  constructor(
    public readonly id: string,
    public archetype: ProfessionArchetype,
    public availableRealmTypes: RealmType[],
    public fixedRealmTypes: RealmType[],
    public skillCosts: ProfessionSkillCosts,
    public professionalSkills: string[],
    public entitySource: EntitySource,
    public description: string | undefined,
    public imageUrl: string | undefined,
    public owner: string,
    public createdAt: Date,
    public updatedAt?: Date,
  ) {
    super();
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
      new Date(),
      undefined,
    );
    //TODO apply event
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
    this.updatedAt = new Date();
    //TODO apply event
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
      props.createdAt,
      props.updatedAt,
    );
  }

  toProps(): ProfessionProps {
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
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
