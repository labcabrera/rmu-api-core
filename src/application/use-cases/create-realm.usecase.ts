import { inject, injectable } from 'inversify';

import { CreateRealmCommand } from '@application/commands/create-realm.command';
import { Realm } from '@domain/entities/realm';
import { ConflictError, ValidationError } from '@domain/errors/errors';
import { RealmRepository } from '@application/ports/outbound/realm-repository';
import { EventNotificationPort } from '@application/ports/outbound/event-notification.port';
import { RealmCreatedEvent } from '@domain/events/realm-created.event';

@injectable()
export class CreateRealmUseCase {
  constructor(
    @inject('RealmRepository') private readonly realmRepository: RealmRepository,
    @inject('EventNotificationPort') private readonly eventNotificationPort: EventNotificationPort
  ) {}

  async execute(command: CreateRealmCommand): Promise<Realm> {
    this.validate(command);
    const exists = await this.realmRepository.findById(command.id);
    if (exists) {
      throw new ConflictError(`Realm ${command.id} already exists`);
    }
    const realm: Partial<Realm> = {
      id: command.id,
      name: command.name,
      owner: command.username,
      createdAt: new Date(),
    };
    const savedRealm = await this.realmRepository.save(realm);
    await this.eventNotificationPort.notify(new RealmCreatedEvent(savedRealm));
    return savedRealm;
  }

  validate(command: CreateRealmCommand): void {
    if (!command.id) throw new ValidationError('Required realm id');
    if (!command.username) throw new ValidationError('Required username');
  }
}
