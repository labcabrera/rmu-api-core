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
    public name: string,
    public category: EnumerationCategory,
    public realmId: string | null,
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
      props.name,
      props.category,
      props.realmId,
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
      props.name,
      props.category,
      props.realmId,
      props.owner,
      props.accessType,
      props.entitySource,
      props.createdAt,
      props.updatedAt,
    );
  }

  update(pros: Omit<Partial<EnumerationProps>, 'id' | 'createdAt' | 'updatedAt'>) {
    let modified = false;
    if (pros.name) {
      modified = this.name !== pros.name;
      this.name = pros.name;
    }
    if (pros.category) {
      modified = modified || this.category !== pros.category;
      this.category = pros.category;
    }
    if (Object.prototype.hasOwnProperty.call(pros, 'realmId')) {
      const newRealmId = pros.realmId as string | null;
      modified = modified || this.realmId !== newRealmId;
      this.realmId = newRealmId;
    }
    if (pros.accessType) {
      modified = modified || this.accessType !== pros.accessType;
      this.accessType = pros.accessType;
    }
    if (pros.entitySource) {
      modified = modified || this.entitySource !== pros.entitySource;
      this.entitySource = pros.entitySource;
    }
    if (!modified) throw new NotModifiedError('No changes detected');
    this.updatedAt = new Date();
  }

  public getProps(): EnumerationProps {
    return {
      id: this.id,
      name: this.name,
      category: this.category,
      realmId: this.realmId,
      owner: this.owner,
      accessType: this.accessType,
      entitySource: this.entitySource,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
