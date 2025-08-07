import { Inject, Injectable, Logger } from '@nestjs/common';

import * as realmEventProducer from '../ports/outbound/realm-event-producer';
import * as realmRepository from '../ports/outbound/realm-repository';
import { Realm } from '../../domain/entities/realm';
import { ConflictError, ValidationError } from '../../domain/errors/errors';
import { CreateRealmCommand } from '../commands/create-realm.command';

@Injectable()
export class CreateRealmUseCase {
  private readonly logger = new Logger(CreateRealmUseCase.name);

  constructor(
    @Inject('RealmRepository') private readonly realmRepository: realmRepository.RealmRepository,
    @Inject('RealmEventProducer') private readonly realmEventProducer: realmEventProducer.RealmEventProducer,
  ) {}

  async execute(command: CreateRealmCommand): Promise<Realm> {
    this.validate(command);
    this.logger.log(`Creating realm ${command.id} for user ${command.username}`);
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
    await this.realmEventProducer.created(savedRealm);
    return savedRealm;
  }

  validate(command: CreateRealmCommand): void {
    if (!command.id) throw new ValidationError('Required realm id');
    if (!command.username) throw new ValidationError('Required username');
  }
}
