import { AggregateRoot } from '@nestjs/cqrs';
import { TraitCreatedEvent } from '../events/trait-created.event';
import { TraitUpdatedEvent } from '../events/trait-updated.event';
import { TraitCategory } from '../value-objects/trait-category.vo';
import { TraitSpecialization } from '../value-objects/trait-specialization.vo';
import { DomainEvent } from 'src/modules/shared/domain/events/domain-event';

export interface TraitProps {
  id: string;
  name: string;
  category: TraitCategory;
  isTalent: boolean;
  specialization: TraitSpecialization;
  isTierBased: boolean;
  maxTier: number | undefined;
  adquisitionCost: number;
  tierCost: number | undefined;
  description: string | undefined;
  owner: string;
  createdAt: Date;
  updatedAt?: Date;
}

export class Trait extends AggregateRoot<DomainEvent<TraitProps>> {
  private constructor(
    public id: string,
    public name: string,
    public category: TraitCategory,
    public isTalent: boolean,
    public specialization: TraitSpecialization,
    public isTierBased: boolean,
    public maxTier: number | undefined,
    public adquisitionCost: number,
    public tierCost: number | undefined,
    public description: string | undefined,
    public owner: string,
    public createdAt: Date,
    public updatedAt: Date | undefined,
  ) {
    super();
  }
  static create(props: Omit<TraitProps, 'id' | 'createdAt' | 'updatedAt'>): Trait {
    const trait = new Trait(
      props.name
        .trim()
        .replaceAll(' ', '-')
        .replace(/[^a-zA-Z0-9-]/g, '')
        .toLowerCase(),
      props.name,
      props.category,
      props.isTalent,
      props.specialization,
      props.isTierBased,
      props.maxTier,
      props.adquisitionCost,
      props.tierCost,
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
      props.name,
      props.category,
      props.isTalent,
      props.specialization,
      props.isTierBased,
      props.maxTier,
      props.adquisitionCost,
      props.tierCost,
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
      name: this.name,
      category: this.category,
      isTalent: this.isTalent,
      specialization: this.specialization,
      isTierBased: this.isTierBased,
      maxTier: this.maxTier,
      adquisitionCost: this.adquisitionCost,
      tierCost: this.tierCost,
      description: this.description,
      owner: this.owner,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  update(props: Partial<Omit<TraitProps, 'id' | 'owner' | 'createdAt' | 'updatedAt'>>): void {
    const { name, category, isTalent, specialization, isTierBased, maxTier, adquisitionCost, tierCost, description } = props;
    if (name !== undefined) this.name = name;
    if (category !== undefined) this.category = category;
    if (isTalent !== undefined) this.isTalent = isTalent;
    if (specialization !== undefined) this.specialization = specialization;
    if (isTierBased !== undefined) this.isTierBased = isTierBased;
    if (maxTier !== undefined) this.maxTier = maxTier;
    if (adquisitionCost !== undefined) this.adquisitionCost = adquisitionCost;
    if (tierCost !== undefined) this.tierCost = tierCost;
    if (description !== undefined) this.description = description;
    this.updatedAt = new Date();
    this.apply(new TraitUpdatedEvent(this.getProps()));
  }
}
