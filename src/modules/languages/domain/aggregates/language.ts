import { AggregateRoot } from '@nestjs/cqrs';
import { LanguageCreatedEvent } from '../events/language-created.event';
import { LanguageUpdatedEvent } from '../events/language-updated.event';
import { randomUUID } from 'crypto';
import { DomainEvent } from 'src/modules/shared/domain/events/domain-event';
import { NamedEntity } from 'src/modules/shared/domain/entities/named-entity';
import { LanguageProps } from './language.props';

export class Language extends AggregateRoot<DomainEvent<LanguageProps>> {
  private constructor(
    public id: string,
    public name: string,
    public realm: NamedEntity,
    public description: string | undefined,
    public owner: string,
    public createdAt: Date,
    public updatedAt: Date | undefined,
  ) {
    super();
  }
  static create(props: Omit<LanguageProps, 'id' | 'createdAt' | 'updatedAt'>) {
    const language = new Language(randomUUID(), props.name, props.realm, props.description, props.owner, new Date(), undefined);
    language.apply(new LanguageCreatedEvent(language.getProps()));
    return language;
  }

  static fromProps(props: LanguageProps) {
    return new Language(props.id, props.name, props.realm, props.description, props.owner, props.createdAt, props.updatedAt);
  }

  getProps(): LanguageProps {
    return {
      id: this.id,
      name: this.name,
      realm: this.realm,
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
    this.apply(new LanguageUpdatedEvent(this.getProps()));
  }
}
