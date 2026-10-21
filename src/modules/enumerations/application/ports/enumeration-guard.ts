import { EntityGuard } from '../../../shared/application/ports/entity-guard';
import { Enumeration } from '../../domain/aggregates/enumeration';

export type EnumerationGuardPort = EntityGuard<Enumeration>;
