import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Culture } from 'src/modules/cultures/domain/aggregates/culture';
import type { CultureRepository } from '../../ports/culture-repository';
import type { CultureGuardPort } from '../../ports/culture-guard.port';
import type { CultureEventBusPort } from '../../ports/culture-event-bus.port';
import { AddCultureFixedSkillRankCommand } from '../commands/add-culture-fixed-skill-rank.command';
import { NotFoundError } from 'src/modules/shared/domain/errors/errors';
import { CultureUpdatedEvent } from 'src/modules/cultures/domain/events/culture-updated.event';

@CommandHandler(AddCultureFixedSkillRankCommand)
export class AddCultureFixedSkillRankHandler implements ICommandHandler<AddCultureFixedSkillRankCommand, Culture> {
  private readonly logger = new Logger(AddCultureFixedSkillRankHandler.name);

  constructor(
    @Inject('CultureRepository') private readonly cultureRepository: CultureRepository,
    @Inject('CultureGuard') private readonly cultureGuard: CultureGuardPort,
    @Inject('CultureEventProducer') private readonly cultureEventBus: CultureEventBusPort,
  ) {}

  async execute(command: AddCultureFixedSkillRankCommand): Promise<Culture> {
    this.logger.log(`Creating culture ${command.cultureId} for user ${command.userId}`);

    const culture = await this.cultureRepository.findById(command.cultureId);
    if (!culture) throw new NotFoundError('Culture', command.cultureId);

    this.cultureGuard.checkUpdate(culture, command.userId, command.roles);

    culture.addFixedSkillRank(command.skillId, command.specialization, command.ranks);

    await this.cultureRepository.update(command.cultureId, culture);

    this.cultureEventBus.publish(new CultureUpdatedEvent(culture.getProps()));
    return culture;
  }
}
