import { AggregateRoot } from '@nestjs/cqrs';
import { RealmCreatedEvent } from '../events/realm-created.event';
import { RealmUpdatedEvent } from '../events/realm-updated.event';
import { randomUUID } from 'crypto';
import { DomainEvent } from 'src/modules/shared/domain/events/domain-event';

export class RealmProps {
  id: string;
  name: string;
  shortDescription?: string;
  description?: string;
  imageUrl?: string;
  owner: string;
  createdAt: Date;
  updatedAt?: Date;
}

export class Realm extends AggregateRoot<DomainEvent<RealmProps>> {
  private constructor(
    public id: string,
    public name: string,
    public shortDescription: string | undefined,
    public description: string | undefined,
    public imageUrl: string | undefined,
    public owner: string,
    public createdAt: Date,
    public updatedAt: Date | undefined,
  ) {
    super();
  }
  static create(props: Omit<RealmProps, 'id' | 'createdAt' | 'updatedAt'>) {
    const realm = new Realm(
      randomUUID(),
      props.name,
      props.shortDescription,
      props.description,
      props.imageUrl,
      props.owner,
      new Date(),
      undefined,
    );
    realm.apply(new RealmCreatedEvent(realm.getProps()));
    return realm;
  }

  static fromProps(props: RealmProps) {
    return new Realm(
      props.id,
      props.name,
      props.shortDescription,
      props.description,
      props.imageUrl,
      props.owner,
      props.createdAt,
      props.updatedAt,
    );
  }

  getProps(): RealmProps {
    return {
      id: this.id,
      name: this.name,
      shortDescription: this.shortDescription,
      description: this.description,
      imageUrl: this.imageUrl,
      owner: this.owner,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  update(props: Partial<Omit<RealmProps, 'id' | 'owner' | 'createdAt' | 'updatedAt'>>) {
    if (props.name) this.name = props.name;
    if (props.shortDescription) this.shortDescription = props.shortDescription;
    if (props.description) this.description = props.description;
    if (props.imageUrl !== undefined) this.imageUrl = props.imageUrl;
    this.updatedAt = new Date();
    this.apply(new RealmUpdatedEvent(this.getProps()));
  }
}
