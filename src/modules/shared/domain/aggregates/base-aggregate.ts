import { AggregateRoot } from '@nestjs/cqrs';
import { DomainEvent } from '../events/domain-event.js';
import { ConflictError } from '../errors/errors.js';

/**
 * P: props of the aggregate, its whole state. Subclasses expose it through read-only getters and change it only
 * in their own methods, so every change goes through the aggregate's rules and events.
 *
 * The version counts the stored writes (optimistic concurrency, spec 018). It is not part of the props: the
 * repository sets it when it loads or stores the aggregate, and a write fails when the stored version moved on.
 *
 * Unlike the six APIs that copy this template (spec 020, decision 9), core keeps the state in `props`; the version
 * and change detection are the same as theirs (spec 021, decision 9).
 */
export abstract class BaseAggregateRoot<P extends { id: string }> extends AggregateRoot<DomainEvent<P>> {
  // ECMAScript private fields: JSON.stringify leaves them out, so an aggregate serialized as event data or as a
  // response never carries them (F-receta-27).
  #storedVersion = 0;
  #snapshot: string | undefined;

  protected constructor(protected props: P) {
    super();
  }

  get id(): string {
    return this.props.id;
  }

  get version(): number {
    return this.#storedVersion;
  }

  /**
   * Called by the repository with the version of the stored document, when it loads the aggregate and after each
   * write. It also takes the snapshot that hasChanges() compares with.
   */
  restoreVersion(version: number): this {
    this.#storedVersion = version;
    this.#snapshot = this.serializeState();
    return this;
  }

  /**
   * Whether the aggregate differs from what was loaded or last stored (spec 021, decision 9): a PATCH without changes
   * neither writes nor publishes. `updatedAt` does not count. An aggregate that was never stored always has changes.
   */
  hasChanges(): boolean {
    return this.#snapshot === undefined || this.serializeState() !== this.#snapshot;
  }

  private serializeState(): string {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- left out of the comparison
    const { updatedAt: _updatedAt, ...state } = this.getProps() as P & { updatedAt?: unknown };
    return JSON.stringify(state);
  }

  /** Rejects a change made on a stale copy: `expected` is the version the client read (undefined skips the check). */
  checkVersion(expected: number | undefined): void {
    if (expected === undefined || expected === this.#storedVersion) return;
    throw new ConflictError(`${this.id} is at version ${this.#storedVersion}, not ${expected}`, 'version-conflict');
  }

  /** A shallow copy: events and persistence get a snapshot of the state, not the live object. */
  getProps(): P {
    return { ...this.props };
  }
}
