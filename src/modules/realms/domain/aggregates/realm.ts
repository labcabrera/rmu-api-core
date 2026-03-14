import { RealmCreatedEvent } from '../events/realm-created.event';
import { RealmUpdatedEvent } from '../events/realm-updated.event';
import { randomUUID } from 'crypto';
import { RealmProps } from './realm-props';
import { MagicPresence } from '../value-objects/realm-magic-type.vo';
import { AccessType } from 'src/modules/shared/domain/entities/access-type';
import { BaseAggregateRoot } from 'src/modules/shared/domain/aggregates/base-aggregate';

export class Realm extends BaseAggregateRoot<RealmProps> {
  public name: string;
  public magicPresence: MagicPresence;
  public shortDescription: string | undefined;
  public description: string | undefined;
  public imageUrl: string | undefined;
  public owner: string;
  public accessType: AccessType;
  public createdAt: Date;
  public updatedAt: Date | undefined;

  private constructor(
    id: string,
    name: string,
    magicPresence: MagicPresence,
    shortDescription: string | undefined,
    description: string | undefined,
    imageUrl: string | undefined,
    owner: string,
    accessType: AccessType,
    createdAt: Date,
    updatedAt: Date | undefined,
  ) {
    super(id);
    this.name = name;
    this.magicPresence = magicPresence;
    this.shortDescription = shortDescription;
    this.description = description;
    this.imageUrl = imageUrl;
    this.owner = owner;
    this.accessType = accessType;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
  static create(props: Omit<RealmProps, 'id' | 'createdAt' | 'updatedAt'>) {
    const realm = new Realm(
      randomUUID(),
      props.name,
      props.magicPresence,
      props.shortDescription,
      props.description,
      props.imageUrl,
      props.owner,
      props.accessType,
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
      props.magicPresence,
      props.shortDescription,
      props.description,
      props.imageUrl,
      props.owner,
      props.accessType,
      props.createdAt,
      props.updatedAt,
    );
  }

  getProps(): RealmProps {
    return {
      id: this.id,
      name: this.name,
      magicPresence: this.magicPresence,
      shortDescription: this.shortDescription,
      description: this.description,
      imageUrl: this.imageUrl,
      owner: this.owner,
      accessType: this.accessType,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  update(props: Partial<Omit<RealmProps, 'id' | 'owner' | 'createdAt' | 'updatedAt'>>) {
    if (props.name) this.name = props.name;
    if (props.magicPresence) this.magicPresence = props.magicPresence;
    if (props.shortDescription) this.shortDescription = props.shortDescription;
    if (props.description) this.description = props.description;
    if (props.imageUrl !== undefined) this.imageUrl = props.imageUrl;
    if (props.accessType !== undefined) this.accessType = props.accessType;
    this.updatedAt = new Date();
    this.apply(new RealmUpdatedEvent(this.getProps()));
  }
}
