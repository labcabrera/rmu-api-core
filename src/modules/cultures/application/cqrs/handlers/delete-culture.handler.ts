import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundError } from 'src/modules/shared/domain/errors/errors';
import { DeleteCultureCommand } from '../commands/delete-culture.command';
import type { CultureRepository } from '../../ports/culture-repository';
import type { CultureGuardPort } from '../../ports/culture-guard.port';
import type { CultureEventBusPort } from '../../ports/culture-event-bus.port';
import { CultureDeletedEvent } from 'src/modules/cultures/domain/events/culture-deleted.event';

@CommandHandler(DeleteCultureCommand)
export class DeleteCultureHandler implements ICommandHandler<DeleteCultureCommand> {
  private readonly logger = new Logger(DeleteCultureHandler.name);

  constructor(
    @Inject('CultureRepository') private readonly cultureRepository: CultureRepository,
    @Inject('CultureGuard') private readonly cultureGuard: CultureGuardPort,
    @Inject('CultureEventProducer') private readonly raceEventBus: CultureEventBusPort,
  ) {}

  async execute(command: DeleteCultureCommand): Promise<void> {
    this.logger.log(`Deleting culture ${command.id} for user ${command.userId}`);

    const culture = await this.cultureRepository.findById(command.id);
    if (!culture) throw new NotFoundError('Culture', command.id);

    this.cultureGuard.checkDelete(culture, command.userId, command.roles);

    await this.cultureRepository.deleteById(command.id);
    this.raceEventBus.publish(new CultureDeletedEvent(culture.getProps()));
  }
}
