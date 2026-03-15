import { EntityGuard } from 'src/modules/shared/application/ports/entity-guard';
import { Enumeration } from '../../domain/aggregates/enumeration';

export type EnumerationGuardPort = EntityGuard<Enumeration>;
