import { AggregateRoot } from '@nestjs/cqrs';
import { DomainEvent } from 'src/modules/core/domain/events/domain-event';
import { RealmCreatedEvent } from '../events/realm-created.event';
import { RealmUpdatedEvent } from '../events/realm-updated.event';
import { randomUUID } from 'crypto';

export class RealmProps {
  id: string;
  name: string;
  description?: string;
  owner: string;
  createdAt: Date;
  updatedAt?: Date;
}

export class Realm extends AggregateRoot<DomainEvent<RealmProps>> {
  private constructor(
    public id: string,
    public name: string,
    public description: string | undefined,
    public owner: string,
    public createdAt: Date,
    public updatedAt: Date | undefined,
  ) {
    super();
  }
  static create(props: Omit<RealmProps, 'id' | 'createdAt' | 'updatedAt'>) {
    const realm = new Realm(randomUUID(), props.name, props.description, props.owner, new Date(), undefined);
    realm.apply(new RealmCreatedEvent(realm.getProps()));
    return realm;
  }

  static fromProps(props: RealmProps) {
    return new Realm(props.id, props.name, props.description, props.owner, props.createdAt, props.updatedAt);
  }

  getProps(): RealmProps {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      owner: this.owner,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  update(name: string | undefined, description: string | undefined) {
    if (name) this.name = name;
    if (description) this.description = description;
    this.updatedAt = new Date();
    this.apply(new RealmUpdatedEvent(this.getProps()));
  }
}
