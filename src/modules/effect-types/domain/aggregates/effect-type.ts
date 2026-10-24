import { BaseAggregateRoot } from '../../../shared/domain/aggregates/base-aggregate.js';
import type { EffectTypeProps } from './effect-type-props.js';

export class EffectType extends BaseAggregateRoot<EffectTypeProps> {
  private constructor(props: EffectTypeProps) {
    super(props);
  }

  get isPersistent() {
    return this.props.isPersistent;
  }

  get isStackable() {
    return this.props.isStackable;
  }

  get value() {
    return this.props.value;
  }

  get modifier() {
    return this.props.modifier;
  }

  get rounds() {
    return this.props.rounds;
  }

  get text() {
    return this.props.text;
  }

  get location() {
    return this.props.location;
  }

  get delay() {
    return this.props.delay;
  }

  get owner() {
    return this.props.owner;
  }

  get accessType() {
    return this.props.accessType;
  }

  get entitySource() {
    return this.props.entitySource;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(props: Omit<EffectTypeProps, 'createdAt' | 'updatedAt'>) {
    return new EffectType({ ...props, createdAt: new Date(), updatedAt: undefined });
  }

  static fromProps(props: EffectTypeProps) {
    return new EffectType({ ...props });
  }

  /** Applies the given fields; the handler asks hasChanges() whether they changed the state (spec 021). */
  update(props: Omit<Partial<EffectTypeProps>, 'id' | 'createdAt' | 'updatedAt' | 'owner' | 'entitySource'>): void {
    if (props.isPersistent !== undefined) {
      this.props.isPersistent = props.isPersistent;
    }
    if (props.isStackable !== undefined) {
      this.props.isStackable = props.isStackable;
    }
    if (props.value !== undefined) {
      this.props.value = props.value;
    }
    if (props.modifier !== undefined) {
      this.props.modifier = props.modifier;
    }
    if (props.rounds !== undefined) {
      this.props.rounds = props.rounds;
    }
    if (props.text !== undefined) {
      this.props.text = props.text;
    }
    if (props.location !== undefined) {
      this.props.location = props.location;
    }
    if (props.delay !== undefined) {
      this.props.delay = props.delay;
    }
    if (props.accessType !== undefined) {
      this.props.accessType = props.accessType;
    }
    // A change without effect keeps the stored updatedAt: the handler neither writes nor publishes it.
    if (this.hasChanges()) this.props.updatedAt = new Date();
  }
}
