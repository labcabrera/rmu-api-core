import { AggregateRoot } from '@nestjs/cqrs';
import { DomainEvent } from '../events/domain-event.js';
import { ConflictError } from '../errors/errors.js';

/**
 * P: props of the aggregate, its whole state. Subclasses expose it through read-only getters and change it only
 * in their own methods, so every change goes through the aggregate's rules and events.
 *
 * The version counts the stored writes (optimistic concurrency, spec 018). It is not part of the props: the
 * repository sets it when it loads or stores the aggregate, and a write fails when the stored version moved on.
 */
export abstract class BaseAggregateRoot<P extends { id: string }> extends AggregateRoot<DomainEvent<P>> {
  private storedVersion = 0;

  protected constructor(protected props: P) {
    super();
  }

  get id(): string {
    return this.props.id;
  }

  get version(): number {
    return this.storedVersion;
  }

  /** Called by the repository with the version of the stored document. */
  restoreVersion(version: number): this {
    this.storedVersion = version;
    return this;
  }

  /** Rejects a change made on a stale copy: `expected` is the version the client read (undefined skips the check). */
  checkVersion(expected: number | undefined): void {
    if (expected === undefined || expected === this.storedVersion) return;
    throw new ConflictError(`${this.id} is at version ${this.storedVersion}, not ${expected}`, 'version-conflict');
  }

  /** A shallow copy: events and persistence get a snapshot of the state, not the live object. */
  getProps(): P {
    return { ...this.props };
  }
}
