import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import type { CultureRepository } from '../../ports/culture-repository';
import type { CultureGuardPort } from '../../ports/culture-guard.port';
import type { CultureEventBusPort } from '../../ports/culture-event-bus.port';
import { AddCultureSkillRankCommand } from '../commands/add-culture-skill-rank.command';
import { NotFoundError } from '../../../../shared/domain/errors/errors';
import { CultureUpdatedEvent } from '../../../domain/events/culture-updated.event';
import { CultureSkillRank } from '../../../domain/value-objects/culture-skill-rank';
import { CultureViewService } from '../../services/culture-view.service';
import { CultureView } from '../../read-models/culture-view';

@CommandHandler(AddCultureSkillRankCommand)
export class AddCultureSkillRankHandler implements ICommandHandler<AddCultureSkillRankCommand, CultureView> {
  private readonly logger = new Logger(AddCultureSkillRankHandler.name);

  constructor(
    @Inject('CultureRepository') private readonly cultureRepository: CultureRepository,
    @Inject('CultureGuard') private readonly cultureGuard: CultureGuardPort,
    @Inject('CultureEventProducer') private readonly cultureEventBus: CultureEventBusPort,
    private readonly cultureViewService: CultureViewService,
  ) {}

  async execute(command: AddCultureSkillRankCommand): Promise<CultureView> {
    this.logger.log(`Adding skill rank to culture ${command.cultureId} for user ${command.userId}`);

    const culture = await this.cultureRepository.findById(command.cultureId);
    if (!culture) throw new NotFoundError('Culture', command.cultureId);

    this.cultureGuard.checkUpdate(culture, command.userId, command.roles);

    culture.addSkillRank(CultureSkillRank.create(command.skillRank));

    const updated = await this.cultureRepository.update(command.cultureId, culture);

    this.cultureEventBus.publish(new CultureUpdatedEvent(updated.getProps()));
    return this.cultureViewService.toView(updated);
  }
}
