import { BaseAggregateRoot } from 'src/modules/shared/domain/aggregates/base-aggregate';
import { AccessType } from 'src/modules/shared/domain/entities/access-type';
import { EnumerationProps } from './enumeration-props';
import { EnumerationCategory } from '../value-objects/enumeration-category.vo';
import { randomUUID } from 'crypto';
import { NotModifiedError } from 'src/modules/shared/domain/errors/errors';
import { EntitySource } from 'src/modules/shared/domain/entities/entity-source';

export class Enumeration extends BaseAggregateRoot<EnumerationProps> {
  private constructor(
    id: string,
    public key: string,
    public category: EnumerationCategory,
    public realmId: string | null,
    public description: string | null,
    public imageUrl: string | null,
    public owner: string,
    public accessType: AccessType,
    public entitySource: EntitySource,
    public createdAt: Date,
    public updatedAt?: Date,
  ) {
    super(id);
  }

  static create(props: Omit<EnumerationProps, 'id' | 'createdAt' | 'updatedAt'>) {
    return new Enumeration(
      randomUUID(),
      props.key,
      props.category,
      props.realmId,
      props.description,
      props.imageUrl,
      props.owner,
      props.accessType,
      props.entitySource,
      new Date(),
      undefined,
    );
  }

  static fromProps(props: EnumerationProps) {
    return new Enumeration(
      props.id,
      props.key,
      props.category,
      props.realmId,
      props.description,
      props.imageUrl,
      props.owner,
      props.accessType,
      props.entitySource,
      props.createdAt,
      props.updatedAt,
    );
  }

  update(props: Omit<Partial<EnumerationProps>, 'id' | 'createdAt' | 'updatedAt'>) {
    let modified = false;
    if (props.key) {
      modified = this.key !== props.key;
      this.key = props.key;
    }
    if (props.category) {
      modified = modified || this.category !== props.category;
      this.category = props.category;
    }
    if (props.realmId) {
      modified = modified || this.realmId !== props.realmId;
      this.realmId = props.realmId;
    }
    if (props.description) {
      modified = modified || this.description !== props.description;
      this.description = props.description;
    }
    if (props.imageUrl) {
      modified = modified || this.imageUrl !== props.imageUrl;
      this.imageUrl = props.imageUrl;
    }
    if (props.accessType) {
      modified = modified || this.accessType !== props.accessType;
      this.accessType = props.accessType;
    }
    if (props.entitySource) {
      modified = modified || this.entitySource !== props.entitySource;
      this.entitySource = props.entitySource;
    }
    if (!modified) throw new NotModifiedError('No changes detected');
    this.updatedAt = new Date();
  }

  public getProps(): EnumerationProps {
    return {
      id: this.id,
      key: this.key,
      category: this.category,
      realmId: this.realmId,
      description: this.description,
      imageUrl: this.imageUrl,
      owner: this.owner,
      accessType: this.accessType,
      entitySource: this.entitySource,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
