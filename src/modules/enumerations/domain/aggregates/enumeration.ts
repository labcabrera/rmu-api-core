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

  /** Applies the given fields and returns whether any of them changed the state. */
  update(props: Omit<Partial<EnumerationProps>, 'id' | 'createdAt' | 'updatedAt'>): boolean {
    let modified = false;
    if (props.key) {
      modified = this.props.key !== props.key;
      this.props.key = props.key;
    }
    if (props.category) {
      modified = modified || this.props.category !== props.category;
      this.props.category = props.category;
    }
    if (props.realmId) {
      modified = modified || this.props.realmId !== props.realmId;
      this.props.realmId = props.realmId;
    }
    if (props.description) {
      modified = modified || this.props.description !== props.description;
      this.props.description = props.description;
    }
    if (props.imageUrl) {
      modified = modified || this.props.imageUrl !== props.imageUrl;
      this.props.imageUrl = props.imageUrl;
    }
    if (props.accessType) {
      modified = modified || this.props.accessType !== props.accessType;
      this.props.accessType = props.accessType;
    }
    if (props.entitySource) {
      modified = modified || this.props.entitySource !== props.entitySource;
      this.props.entitySource = props.entitySource;
    }
    if (!modified) return false;
    this.props.updatedAt = new Date();
    return true;
  }
}
