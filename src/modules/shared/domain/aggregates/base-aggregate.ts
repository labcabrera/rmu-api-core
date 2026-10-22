import { AggregateRoot } from '@nestjs/cqrs';
import { DomainEvent } from '../events/domain-event.js';

/**
 * P: props of the aggregate, its whole state. Subclasses expose it through read-only getters and change it only
 * in their own methods, so every change goes through the aggregate's rules and events.
 */
export abstract class BaseAggregateRoot<P extends { id: string }> extends AggregateRoot<DomainEvent<P>> {
  protected constructor(protected props: P) {
    super();
  }

  get id(): string {
    return this.props.id;
  }

  /** A shallow copy: events and persistence get a snapshot of the state, not the live object. */
  getProps(): P {
    return { ...this.props };
  }
}
