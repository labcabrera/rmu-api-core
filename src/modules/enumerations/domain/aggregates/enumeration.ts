import { BaseAggregateRoot } from '../../../shared/domain/aggregates/base-aggregate.js';
import type { EnumerationProps } from './enumeration-props.js';
import { randomUUID } from 'crypto';

export class Enumeration extends BaseAggregateRoot<EnumerationProps> {
  private constructor(props: EnumerationProps) {
    super(props);
  }

  get key() {
    return this.props.key;
  }

  get category() {
    return this.props.category;
  }

  get realmId() {
    return this.props.realmId;
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

  get entitySource() {
    return this.props.entitySource;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(props: Omit<EnumerationProps, 'id' | 'createdAt' | 'updatedAt'>) {
    return new Enumeration({ ...props, id: randomUUID(), createdAt: new Date(), updatedAt: undefined });
  }

  static fromProps(props: EnumerationProps) {
    return new Enumeration({ ...props });
  }

  /** Applies the given fields; the handler asks hasChanges() whether they changed the state (spec 021). */
  update(props: Omit<Partial<EnumerationProps>, 'id' | 'createdAt' | 'updatedAt'>): void {
    if (props.key) {
      this.props.key = props.key;
    }
    if (props.category) {
      this.props.category = props.category;
    }
    if (props.realmId) {
      this.props.realmId = props.realmId;
    }
    // undefined keeps the value; null or '' clears it (as in realms, spec 018).
    if (props.description !== undefined) {
      this.props.description = props.description || null;
    }
    if (props.imageUrl !== undefined) {
      this.props.imageUrl = props.imageUrl || null;
    }
    if (props.accessType) {
      this.props.accessType = props.accessType;
    }
    if (props.entitySource) {
      this.props.entitySource = props.entitySource;
    }
    // A change without effect keeps the stored updatedAt: the handler neither writes nor publishes it.
    if (this.hasChanges()) this.props.updatedAt = new Date();
  }
}
