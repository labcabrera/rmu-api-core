import { EntityGuard } from 'src/modules/shared/application/ports/entity-guard';
import { Trait } from '../../domain/aggregates/trait';

export type TraitGuardPort = EntityGuard<Trait>;
