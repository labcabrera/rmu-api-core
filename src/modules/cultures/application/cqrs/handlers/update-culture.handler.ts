import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundError } from 'src/modules/shared/domain/errors/errors';
import { UpdateCultureCommand } from '../commands/update-culture.command';
import type { CultureRepository } from '../../ports/culture-repository';
import type { CultureGuardPort } from '../../ports/culture-guard.port';
import type { CultureEventBusPort } from '../../ports/culture-event-bus.port';
import { CultureUpdatedEvent } from 'src/modules/cultures/domain/events/culture-updated.event';
import { CultureSkillRank } from 'src/modules/cultures/domain/value-objects/culture-skill-rank';
import { CultureViewService } from '../../services/culture-view.service';
import { CultureView } from '../../read-models/culture-view';

@CommandHandler(UpdateCultureCommand)
export class UpdateCultureHandler implements ICommandHandler<UpdateCultureCommand, CultureView> {
  private readonly logger = new Logger(UpdateCultureHandler.name);

  constructor(
    @Inject('CultureRepository') private readonly cultureRepository: CultureRepository,
    @Inject('CultureGuard') private readonly cultureGuard: CultureGuardPort,
    @Inject('CultureEventProducer') private readonly cultureEventBus: CultureEventBusPort,
    private readonly cultureViewService: CultureViewService,
  ) {}

  async execute(command: UpdateCultureCommand): Promise<CultureView> {
    this.logger.log(`Updating culture ${command.id} for user ${command.userId}`);
    const culture = await this.cultureRepository.findById(command.id);
    if (!culture) throw new NotFoundError('Culture', command.id);

    this.cultureGuard.checkUpdate(culture, command.userId, command.roles);

    culture.update({
      name: command.name,
      description: command.description,
      imageUrl: command.imageUrl,
      accessType: command.accessType,
      skillRanks: command.skillRanks?.map(s => CultureSkillRank.create(s)),
      languages: command.languages,
      suggestedCrafts: command.suggestedCrafts,
      suggestedVocations: command.suggestedVocations,
    });
    const updated = await this.cultureRepository.update(command.id, culture);
    this.cultureEventBus.publish(new CultureUpdatedEvent(updated.getProps()));
    return this.cultureViewService.toView(updated);
  }
}
