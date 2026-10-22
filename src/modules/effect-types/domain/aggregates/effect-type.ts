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

  /** Applies the given fields and returns whether any of them changed the state. */
  update(props: Omit<Partial<EffectTypeProps>, 'id' | 'createdAt' | 'updatedAt' | 'owner' | 'entitySource'>): boolean {
    let modified = false;

    if (props.isPersistent !== undefined) {
      modified = this.props.isPersistent !== props.isPersistent;
      this.props.isPersistent = props.isPersistent;
    }
    if (props.isStackable !== undefined) {
      modified = modified || this.props.isStackable !== props.isStackable;
      this.props.isStackable = props.isStackable;
    }
    if (props.value !== undefined) {
      modified = modified || this.props.value !== props.value;
      this.props.value = props.value;
    }
    if (props.modifier !== undefined) {
      modified = modified || this.props.modifier !== props.modifier;
      this.props.modifier = props.modifier;
    }
    if (props.rounds !== undefined) {
      modified = modified || this.props.rounds !== props.rounds;
      this.props.rounds = props.rounds;
    }
    if (props.text !== undefined) {
      modified = modified || this.props.text !== props.text;
      this.props.text = props.text;
    }
    if (props.location !== undefined) {
      modified = modified || this.props.location !== props.location;
      this.props.location = props.location;
    }
    if (props.delay !== undefined) {
      modified = modified || this.props.delay !== props.delay;
      this.props.delay = props.delay;
    }
    if (props.accessType !== undefined) {
      modified = modified || this.props.accessType !== props.accessType;
      this.props.accessType = props.accessType;
    }

    if (!modified) return false;
    this.props.updatedAt = new Date();
    return true;
  }
}
