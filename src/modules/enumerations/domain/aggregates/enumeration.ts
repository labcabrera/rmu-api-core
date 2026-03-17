import { BaseAggregateRoot } from 'src/modules/shared/domain/aggregates/base-aggregate';
import { AccessType } from 'src/modules/shared/domain/entities/access-type';
import { EnumerationProps } from './enumeration-props';
import { EnumerationCategory } from '../value-objects/enumeration-category.vo';
import { randomUUID } from 'crypto';
import { NotModifiedError } from 'src/modules/shared/domain/errors/errors';

export class Enumeration extends BaseAggregateRoot<EnumerationProps> {
  private constructor(
    id: string,
    public name: string,
    public category: EnumerationCategory,
    public owner: string,
    public accessType: AccessType,
    public createdAt: Date,
    public updatedAt?: Date,
  ) {
    super(id);
  }

  static create(props: Omit<EnumerationProps, 'id' | 'createdAt' | 'updatedAt'>) {
    return new Enumeration(randomUUID(), props.name, props.category, props.owner, props.accessType, new Date(), undefined);
  }

  static fromProps(props: EnumerationProps) {
    return new Enumeration(props.id, props.name, props.category, props.owner, props.accessType, props.createdAt, props.updatedAt);
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
    if (pros.accessType) {
      modified = modified || this.accessType !== pros.accessType;
      this.accessType = pros.accessType;
    }
    if (!modified) throw new NotModifiedError('No changes detected');
    this.updatedAt = new Date();
  }

  public getProps(): EnumerationProps {
    return {
      id: this.id,
      name: this.name,
      category: this.category,
      owner: this.owner,
      accessType: this.accessType,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
