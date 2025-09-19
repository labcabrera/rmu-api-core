import { AggregateRoot } from '@nestjs/cqrs';
import { DomainEvent } from 'src/modules/core/domain/events/domain-event';
import { TraitCreatedEvent } from '../events/trait-created.event';
import { TraitUpdatedEvent } from '../events/trait-updated.event';
import { TraitCategory } from '../value-objects/trait-category.vo';

export interface TraitProps {
  id: string;
  category: TraitCategory;
  isTalent: boolean;
  requiresSpecialization: boolean;
  isTierBased: boolean;
  maxTier: number | undefined;
  cost: number | undefined;
  description: string | undefined;
  owner: string;
  createdAt: Date;
  updatedAt?: Date;
}

export class Trait extends AggregateRoot<DomainEvent<TraitProps>> {
  private constructor(
    public id: string,
    public category: TraitCategory,
    public isTalent: boolean,
    public requiresSpecialization: boolean,
    public isTierBased: boolean,
    public maxTier: number | undefined,
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
      props.id.toLowerCase().trim().replaceAll(' ', '-'),
      props.category,
      props.isTalent,
      props.requiresSpecialization,
      props.isTierBased,
      props.maxTier,
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
      props.category,
      props.isTalent,
      props.requiresSpecialization,
      props.isTierBased,
      props.maxTier,
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
      category: this.category,
      isTalent: this.isTalent,
      requiresSpecialization: this.requiresSpecialization,
      isTierBased: this.isTierBased,
      maxTier: this.maxTier,
      cost: this.cost,
      description: this.description,
      owner: this.owner,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  update(props: Partial<Omit<TraitProps, 'id' | 'owner' | 'createdAt' | 'updatedAt'>>): void {
    const { category, isTalent, requiresSpecialization, isTierBased, maxTier, cost, description } = props;
    if (category !== undefined) this.category = category;
    if (isTalent !== undefined) this.isTalent = isTalent;
    if (requiresSpecialization !== undefined) this.requiresSpecialization = requiresSpecialization;
    if (isTierBased !== undefined) this.isTierBased = isTierBased;
    if (maxTier !== undefined) this.maxTier = maxTier;
    if (cost !== undefined) this.cost = cost;
    if (description !== undefined) this.description = description;
    this.updatedAt = new Date();
    this.apply(new TraitUpdatedEvent(this.getProps()));
  }
}
