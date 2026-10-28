import { describe, expect, it } from 'vitest';
import { Enumeration } from '../../../../src/modules/enumerations/domain/aggregates/enumeration.js';
import type { EnumerationProps } from '../../../../src/modules/enumerations/domain/aggregates/enumeration-props.js';
import { ENUMERATION_CATEGORIES } from '../../../../src/modules/enumerations/domain/value-objects/enumeration-category.vo.js';

const baseProps = (): EnumerationProps => ({
  id: 'enum-1',
  key: 'westron',
  category: 'language',
  realmId: null,
  description: null,
  imageUrl: null,
  owner: 'user-1',
  accessType: 'private',
  entitySource: 'user',
  createdAt: new Date('2026-02-01T00:00:00.000Z'),
  updatedAt: undefined,
});

describe('Enumeration', () => {
  it('creates an enumeration with generated identity and nullable fields', () => {
    const enumeration = Enumeration.create({
      key: 'mithril',
      category: 'material-lore',
      realmId: null,
      description: null,
      imageUrl: null,
      owner: 'user-1',
      accessType: 'public',
      entitySource: 'system',
    });

    expect(enumeration.id).toEqual(expect.any(String));
    expect(enumeration.createdAt).toBeInstanceOf(Date);
    expect(enumeration.updatedAt).toBeUndefined();
    expect(enumeration.getProps()).toMatchObject({
      key: 'mithril',
      category: 'material-lore',
      realmId: null,
      description: null,
      imageUrl: null,
      owner: 'user-1',
      accessType: 'public',
      entitySource: 'system',
    });
  });

  it('rehydrates from persisted props exactly', () => {
    const props = baseProps();

    const enumeration = Enumeration.fromProps(props);

    expect(enumeration.getProps()).toEqual(props);
  });

  it('updates changed mutable fields and sets updatedAt', () => {
    const enumeration = Enumeration.fromProps(baseProps());

    enumeration.update({
      key: 'quenya',
      category: 'language',
      realmId: 'realm-1',
      description: 'Elven language',
      imageUrl: 'https://example.test/quenya.png',
      accessType: 'public',
      entitySource: 'system',
    });

    expect(enumeration.getProps()).toMatchObject({
      key: 'quenya',
      category: 'language',
      realmId: 'realm-1',
      description: 'Elven language',
      imageUrl: 'https://example.test/quenya.png',
      owner: 'user-1',
      accessType: 'public',
      entitySource: 'system',
    });
    expect(enumeration.updatedAt).toBeInstanceOf(Date);
  });

  it('reports no change when update has no effective changes', () => {
    const enumeration = Enumeration.fromProps(baseProps()).restoreVersion(0);

    enumeration.update({});
    enumeration.update({ key: 'westron' });
    expect(enumeration.hasChanges()).toBe(false);

    enumeration.update({ key: 'adunaic' });
    expect(enumeration.hasChanges()).toBe(true);
  });

  it.each([null, ''])('clears the description and the image with %j, and keeps them when undefined', cleared => {
    const enumeration = Enumeration.fromProps({ ...baseProps(), description: 'Old', imageUrl: 'old.png' });

    enumeration.update({ description: undefined, imageUrl: undefined });
    expect(enumeration.getProps()).toMatchObject({ description: 'Old', imageUrl: 'old.png' });

    enumeration.update({ description: cleared, imageUrl: cleared });
    expect(enumeration.getProps()).toMatchObject({ description: null, imageUrl: null });
  });

  it('exposes the expected enumeration category catalog without duplicates', () => {
    expect(ENUMERATION_CATEGORIES).toContain('language');
    expect(ENUMERATION_CATEGORIES).toContain('skill-influence');
    expect(new Set(ENUMERATION_CATEGORIES).size).toBe(ENUMERATION_CATEGORIES.length);
  });
});
