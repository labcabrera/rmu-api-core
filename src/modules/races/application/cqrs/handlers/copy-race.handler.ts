import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import { Race } from '../../../domain/aggregates/race.js';
import { CopyRaceCommand } from '../commands/copy-race.command.js';
import { REALM_REPOSITORY, type RealmRepository } from '../../../../realms/application/ports/realm-repository.port.js';
import { REALM_GUARD, type RealmGuardPort } from '../../../../realms/application/ports/realm-guard.port.js';
import { RACE_REPOSITORY, type RaceRepository } from '../../ports/race-repository.port.js';
import { RACE_GUARD, type RaceGuardPort } from '../../ports/race-guard.port.js';
import { NotFoundError, ValidationError } from '../../../../shared/domain/errors/errors.js';
import { DOMAIN_EVENT_PUBLISHER, type DomainEventPublisher } from '../../../../shared/application/ports/domain-event-publisher.port.js';

/**
 * Copies a race into a realm (workspace spec 074): who reads the race and writes the target realm gets a new race of
 * theirs with all its data, as a user race with the access type of the target realm.
 */
@CommandHandler(CopyRaceCommand)
export class CopyRaceHandler implements ICommandHandler<CopyRaceCommand, Race> {
  private readonly logger = new Logger(CopyRaceHandler.name);

  constructor(
    @Inject(RACE_REPOSITORY) private readonly raceRepository: RaceRepository,
    @Inject(REALM_REPOSITORY) private readonly realmRepository: RealmRepository,
    @Inject(RACE_GUARD) private readonly raceGuard: RaceGuardPort,
    @Inject(REALM_GUARD) private readonly realmGuard: RealmGuardPort,
    @Inject(DOMAIN_EVENT_PUBLISHER) private readonly events: DomainEventPublisher,
  ) {}

  async execute(command: CopyRaceCommand): Promise<Race> {
    this.logger.log(`Copying race ${command.id} as ${command.name} for user ${command.userId} into realm ${command.realmId}`);

    this.raceGuard.checkCreate(command.roles);
    const source = await this.raceRepository.findById(command.id);
    if (!source) throw new NotFoundError('Race', command.id);
    await this.raceGuard.checkRead(source, command.userId, command.roles);
    const realm = await this.realmRepository.findById(command.realmId);
    if (!realm) throw new ValidationError(`Realm with id ${command.realmId} does not exist`);
    // As a creation: only who can change the target realm adds races to it.
    this.realmGuard.checkUpdate(realm, command.userId, command.roles);

    const copy = source.copyTo({ name: command.name, realmId: realm.id, owner: command.userId, accessType: realm.accessType });
    const saved = await this.raceRepository.save(copy);
    await this.events.publishChanges('race', copy);
    return saved;
  }
}
