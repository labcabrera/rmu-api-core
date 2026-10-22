import { TraitCreatedEvent } from '../events/trait-created.event.js';
import { TraitUpdatedEvent } from '../events/trait-updated.event.js';
import type { TraitProps } from './trait-props.js';
import { BaseAggregateRoot } from '../../../shared/domain/aggregates/base-aggregate.js';

export class Trait extends BaseAggregateRoot<TraitProps> {
  private constructor(props: TraitProps) {
    super(props);
  }

  get name() {
    return this.props.name;
  }

  get category() {
    return this.props.category;
  }

  get isTalent() {
    return this.props.isTalent;
  }

  get specialization() {
    return this.props.specialization;
  }

  get isTierBased() {
    return this.props.isTierBased;
  }

  get maxTier() {
    return this.props.maxTier;
  }

  get adquisitionCost() {
    return this.props.adquisitionCost;
  }

  get tierCost() {
    return this.props.tierCost;
  }

  get description() {
    return this.props.description;
  }

  get owner() {
    return this.props.owner;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
  static create(props: Omit<TraitProps, 'id' | 'createdAt' | 'updatedAt'>): Trait {
    const trait = new Trait({
      ...props,
      id: props.name
        .trim()
        .replaceAll(' ', '-')
        .replace(/[^a-zA-Z0-9-]/g, '')
        .toLowerCase(),
      createdAt: new Date(),
      updatedAt: undefined,
    });
    trait.apply(new TraitCreatedEvent(trait.getProps()));
    return trait;
  }

  static fromProps(props: TraitProps): Trait {
    const trait = new Trait({ ...props });
    return trait;
  }

  update(props: Partial<Omit<TraitProps, 'id' | 'owner' | 'createdAt' | 'updatedAt'>>): void {
    const { name, category, isTalent, specialization, isTierBased, maxTier, adquisitionCost, tierCost, description } = props;
    if (name !== undefined) this.props.name = name;
    if (category !== undefined) this.props.category = category;
    if (isTalent !== undefined) this.props.isTalent = isTalent;
    if (specialization !== undefined) this.props.specialization = specialization;
    if (isTierBased !== undefined) this.props.isTierBased = isTierBased;
    if (maxTier !== undefined) this.props.maxTier = maxTier;
    if (adquisitionCost !== undefined) this.props.adquisitionCost = adquisitionCost;
    if (tierCost !== undefined) this.props.tierCost = tierCost;
    if (description !== undefined) this.props.description = description;
    this.props.updatedAt = new Date();
    this.apply(new TraitUpdatedEvent(this.getProps()));
  }
}
