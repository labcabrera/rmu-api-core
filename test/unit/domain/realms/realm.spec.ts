import { describe, expect, it } from 'vitest';
import { Realm } from '../../../../src/modules/realms/domain/aggregates/realm.js';
import { RealmCreatedEvent } from '../../../../src/modules/realms/domain/events/realm-created.event.js';
import { RealmDeletedEvent } from '../../../../src/modules/realms/domain/events/realm-deleted.event.js';
import { RealmUpdatedEvent } from '../../../../src/modules/realms/domain/events/realm-updated.event.js';
import type { RealmProps } from '../../../../src/modules/realms/domain/aggregates/realm-props.js';

const baseProps = (): RealmProps => ({
  id: 'realm-1',
  name: 'Shadow World',
  magicPresence: 'limited',
  shortDescription: 'A dangerous mirror realm',
  description: 'Long description',
  imageUrl: 'https://example.test/shadow.png',
  owner: 'user-1',
  accessType: 'private',
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-02T00:00:00.000Z'),
});

describe('Realm', () => {
  it('creates a realm with generated identity, creation date and created event', () => {
    const realm = Realm.create({
      name: 'Middle-Earth',
      magicPresence: 'unlimited',
      shortDescription: undefined,
      description: undefined,
      imageUrl: undefined,
      owner: 'user-1',
      accessType: 'public',
    });

    expect(realm.id).toEqual(expect.any(String));
    expect(realm.createdAt).toBeInstanceOf(Date);
    expect(realm.updatedAt).toBeUndefined();
    expect(realm.getProps()).toMatchObject({
      name: 'Middle-Earth',
      magicPresence: 'unlimited',
      owner: 'user-1',
      accessType: 'public',
    });
    expect(realm.getUncommittedEvents()).toHaveLength(1);
    expect(realm.getUncommittedEvents()[0]).toBeInstanceOf(RealmCreatedEvent);
  });

  it('rehydrates a realm from persisted props without creating events', () => {
    const props = baseProps();

    const realm = Realm.fromProps(props);

    expect(realm.getProps()).toEqual(props);
    expect(realm.getUncommittedEvents()).toEqual([]);
  });

  it('updates mutable fields, records updatedAt and emits an updated event', () => {
    const realm = Realm.fromProps(baseProps());

    realm.update({
      name: 'Emer',
      magicPresence: 'none',
      imageUrl: 'https://example.test/emer.png',
      accessType: 'public',
    });

    expect(realm.getProps()).toMatchObject({
      name: 'Emer',
      magicPresence: 'none',
      imageUrl: 'https://example.test/emer.png',
      owner: 'user-1',
      accessType: 'public',
    });
    expect(realm.updatedAt).toBeInstanceOf(Date);
    expect(realm.getUncommittedEvents()).toHaveLength(1);
    expect(realm.getUncommittedEvents()[0]).toBeInstanceOf(RealmUpdatedEvent);
  });

  it('clears the optional texts with an empty string or null and leaves undefined fields alone', () => {
    const realm = Realm.fromProps({ ...baseProps(), description: 'Long text', imageUrl: 'https://example.test/a.png' });

    realm.update({ shortDescription: '', description: null, name: undefined });

    expect(realm.shortDescription).toBeUndefined();
    expect(realm.description).toBeUndefined();
    expect(realm.imageUrl).toBe('https://example.test/a.png');
    expect(realm.name).toBe('Shadow World');
  });

  it('keeps the name and magic presence when they come empty', () => {
    const realm = Realm.fromProps(baseProps());

    realm.update({ name: '', magicPresence: undefined });

    expect(realm.name).toBe('Shadow World');
    expect(realm.magicPresence).toBe('limited');
  });

  it('builds realm lifecycle events with the expected event types', () => {
    const props = baseProps();

    expect(new RealmCreatedEvent(props)).toMatchObject({ eventType: 'created', data: props });
    expect(new RealmUpdatedEvent(props)).toMatchObject({ eventType: 'updated', data: props });
    expect(new RealmDeletedEvent(props)).toMatchObject({ eventType: 'deleted', data: props });
  });
});
