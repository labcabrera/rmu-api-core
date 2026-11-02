import { describe, expect, it } from 'vitest';
import { BaseAggregateRoot } from '../../../../src/modules/shared/domain/aggregates/base-aggregate.js';
import { ConflictError } from '../../../../src/modules/shared/domain/errors/errors.js';

type SampleProps = { id: string; name: string; tags: string[]; nested: { level: number }; updatedAt?: Date };

class Sample extends BaseAggregateRoot<SampleProps> {
  constructor(props: SampleProps) {
    super(props);
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  rename(name: string) {
    this.props.name = name;
    this.props.updatedAt = new Date();
  }

  tag(tag: string) {
    this.props.tags = [...this.props.tags, tag];
  }

  level(level: number) {
    this.props.nested = { level };
  }
}

const sample = () => new Sample({ id: 'sample-1', name: 'Sample', tags: ['a'], nested: { level: 1 } });

describe('BaseAggregateRoot', () => {
  it('has changes until it is stored, as an aggregate made with create()', () => {
    const created = sample();

    expect(created.hasChanges()).toBe(true);
    created.restoreVersion(0);
    expect(created.hasChanges()).toBe(false);
  });

  it('reports no change when the state ends as it was loaded', () => {
    const loaded = sample().restoreVersion(3);

    loaded.rename('Sample');
    loaded.level(1);

    expect(loaded.hasChanges()).toBe(false);
  });

  it('ignores updatedAt', () => {
    const loaded = sample().restoreVersion(0);

    loaded.rename('Sample');

    expect(loaded.updatedAt).toBeInstanceOf(Date);
    expect(loaded.hasChanges()).toBe(false);
  });

  it.each([
    ['a field', (s: Sample) => s.rename('Other')],
    ['an array', (s: Sample) => s.tag('b')],
    ['a nested object', (s: Sample) => s.level(2)],
  ])('detects a change of %s', (_, change) => {
    const loaded = sample().restoreVersion(0);

    change(loaded);

    expect(loaded.hasChanges()).toBe(true);
  });

  it('takes a new snapshot after each write', () => {
    const loaded = sample().restoreVersion(0);
    loaded.rename('Other');

    loaded.restoreVersion(1);

    expect(loaded.version).toBe(1);
    expect(loaded.hasChanges()).toBe(false);
  });

  it('keeps the version out of the serialized aggregate (F-receta-27)', () => {
    const loaded = sample().restoreVersion(7);

    const json = JSON.parse(JSON.stringify(loaded)) as Record<string, unknown>;

    expect(loaded.version).toBe(7);
    expect(JSON.stringify(json)).not.toContain('7');
    expect(Object.keys(json)).not.toContain('storedVersion');
  });

  it('rejects a stale version and accepts the current one or none', () => {
    const loaded = sample().restoreVersion(2);

    expect(() => loaded.checkVersion(2)).not.toThrow();
    expect(() => loaded.checkVersion(undefined)).not.toThrow();
    expect(() => loaded.checkVersion(1)).toThrow(ConflictError);
  });
});
