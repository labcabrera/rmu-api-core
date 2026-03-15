import { LanguageCreatedEvent } from '../events/language-created.event';
import { LanguageUpdatedEvent } from '../events/language-updated.event';
import { randomUUID } from 'crypto';
import { NamedEntity } from 'src/modules/shared/domain/entities/named-entity';
import { LanguageProps } from './language.props';
import { AccessType } from 'src/modules/shared/domain/entities/access-type';
import { BaseAggregateRoot } from 'src/modules/shared/domain/aggregates/base-aggregate';

export class Language extends BaseAggregateRoot<LanguageProps> {
  private constructor(
    id: string,
    public name: string,
    public realm: NamedEntity,
    public description: string | undefined,
    public owner: string,
    public accessType: AccessType,
    public createdAt: Date,
    public updatedAt: Date | undefined,
  ) {
    super(id);
  }
  static create(props: Omit<LanguageProps, 'id' | 'createdAt' | 'updatedAt'>) {
    const language = new Language(
      randomUUID(),
      props.name,
      props.realm,
      props.description,
      props.owner,
      props.accessType,
      new Date(),
      undefined,
    );
    language.apply(new LanguageCreatedEvent(language.getProps()));
    return language;
  }

  static fromProps(props: LanguageProps) {
    return new Language(
      props.id,
      props.name,
      props.realm,
      props.description,
      props.owner,
      props.accessType,
      props.createdAt,
      props.updatedAt,
    );
  }

  getProps(): LanguageProps {
    return {
      id: this.id,
      name: this.name,
      realm: this.realm,
      description: this.description,
      owner: this.owner,
      accessType: this.accessType,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  update(name: string | undefined, description: string | undefined) {
    if (name) this.name = name;
    if (description) this.description = description;
    this.updatedAt = new Date();
    this.apply(new LanguageUpdatedEvent(this.getProps()));
  }
}
