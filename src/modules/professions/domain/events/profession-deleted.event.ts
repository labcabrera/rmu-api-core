import { DomainEvent } from '../../../shared/domain/events/domain-event.js';
import type { ProfessionProps } from '../aggregates/profession-props.js';

export class ProfessionDeletedEvent extends DomainEvent<ProfessionProps> {
  constructor(data: ProfessionProps) {
    super('deleted', data);
  }
}
