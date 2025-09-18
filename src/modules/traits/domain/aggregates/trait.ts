import { AggregateRoot } from '@nestjs/cqrs';
import { DomainEvent } from 'src/modules/core/domain/events/domain-event';
import { TraitCreatedEvent } from '../events/trait-created.event';
import { TraitUpdatedEvent } from '../events/trait-updated.event';

export interface TraitProps {
  id: string;
  isTalent: boolean;
  requiresSpecialization: boolean;
  cost: number | undefined;
  description: string | undefined;
  owner: string;
  createdAt: Date;
  updatedAt?: Date;
}

export class Trait extends AggregateRoot<DomainEvent<TraitProps>> {
  private constructor(
    public id: string,
    public isTalent: boolean,
    public requiresSpecialization: boolean,
    public cost: number | undefined,
    public description: string | undefined,
    public owner: string,
    public createdAt: Date,
    public updatedAt: Date | undefined,
  ) {
    super();
  }
  static create(props: Omit<TraitProps, 'createdAt' | 'updatedAt'>): Trait {
    const trait = new Trait(
      props.id,
      props.isTalent,
      props.requiresSpecialization,
      props.cost,
      props.description,
      props.owner,
      new Date(),
      undefined,
    );
    trait.apply(new TraitCreatedEvent(trait.getProps()));
    return trait;
  }

  static fromProps(props: TraitProps): Trait {
    const trait = new Trait(
      props.id,
      props.isTalent,
      props.requiresSpecialization,
      props.cost,
      props.description,
      props.owner,
      props.createdAt,
      props.updatedAt,
    );
    return trait;
  }

  getProps(): TraitProps {
    return {
      id: this.id,
      isTalent: this.isTalent,
      requiresSpecialization: this.requiresSpecialization,
      cost: this.cost,
      description: this.description,
      owner: this.owner,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  update(
    isTalent: boolean | undefined,
    requiresSpecialization: boolean | undefined,
    cost: number | undefined,
    description: string | undefined,
  ) {
    if (isTalent !== undefined) this.isTalent = isTalent;
    if (requiresSpecialization !== undefined) this.requiresSpecialization = requiresSpecialization;
    if (cost !== undefined) this.cost = cost;
    if (description) this.description = description;
    this.updatedAt = new Date();
    this.apply(new TraitUpdatedEvent(this.getProps()));
  }
}
