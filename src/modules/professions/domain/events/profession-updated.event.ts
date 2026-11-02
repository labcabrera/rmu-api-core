import { DomainEvent } from '../../../shared/domain/events/domain-event.js';
import type { ProfessionProps } from '../aggregates/profession-props.js';

export class ProfessionUpdatedEvent extends DomainEvent<ProfessionProps> {
  constructor(data: ProfessionProps) {
    super('updated', data);
  }
}
