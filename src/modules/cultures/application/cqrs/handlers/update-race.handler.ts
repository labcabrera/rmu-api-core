import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundError } from 'src/modules/shared/domain/errors/errors';
import { UpdateCultureCommand } from '../commands/update-culture.command';
import { Culture } from 'src/modules/cultures/domain/aggregates/culture';
import type { CultureRepository } from '../../ports/culture-repository';
import type { CultureGuardPort } from '../../ports/culture-guard.port';
import type { CultureEventBusPort } from '../../ports/culture-event-bus.port';
import { CultureUpdatedEvent } from 'src/modules/cultures/domain/events/culture-updated.event';

@CommandHandler(UpdateCultureCommand)
export class UpdateCultureHandler implements ICommandHandler<UpdateCultureCommand, Culture> {
  constructor(
    @Inject('CultureRepository') private readonly cultureRepository: CultureRepository,
    @Inject('CultureGuard') private readonly cultureGuard: CultureGuardPort,
    @Inject('CultureEventProducer') private readonly cultureEventBus: CultureEventBusPort,
  ) {}

  async execute(command: UpdateCultureCommand): Promise<Culture> {
    const culture = await this.cultureRepository.findById(command.id);
    if (!culture) throw new NotFoundError('Race', command.id);

    this.cultureGuard.checkUpdate(culture, command.userId, command.roles);

    const props = {
      name: command.name,
      description: command.description,
      imageUrl: command.imageUrl,
      accessType: command.accessType,
    };
    culture.update(props);
    const updated = await this.cultureRepository.update(command.id, culture);
    this.cultureEventBus.publish(new CultureUpdatedEvent(updated.getProps()));
    return updated;
  }
}
