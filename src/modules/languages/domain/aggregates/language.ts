import { AggregateRoot } from '@nestjs/cqrs';
import { LanguageCreatedEvent } from '../events/language-created.event';
import { LanguageUpdatedEvent } from '../events/language-updated.event';
import { randomUUID } from 'crypto';
import { DomainEvent } from 'src/modules/shared/domain/events/domain-event';

export class LanguageProps {
  id: string;
  name: string;
  realmId: string;
  realmName: string;
  description?: string;
  owner: string;
  createdAt: Date;
  updatedAt?: Date;
}

export class Language extends AggregateRoot<DomainEvent<LanguageProps>> {
  private constructor(
    public id: string,
    public name: string,
    public realmId: string,
    public realmName: string,
    public description: string | undefined,
    public owner: string,
    public createdAt: Date,
    public updatedAt: Date | undefined,
  ) {
    super();
  }
  static create(props: Omit<LanguageProps, 'id' | 'createdAt' | 'updatedAt'>) {
    const language = new Language(
      randomUUID(),
      props.name,
      props.realmId,
      props.realmName,
      props.description,
      props.owner,
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
      props.realmId,
      props.realmName,
      props.description,
      props.owner,
      props.createdAt,
      props.updatedAt,
    );
  }

  getProps(): LanguageProps {
    return {
      id: this.id,
      name: this.name,
      realmId: this.realmId,
      realmName: this.realmName,
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
