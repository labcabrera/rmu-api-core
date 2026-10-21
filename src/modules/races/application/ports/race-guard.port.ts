import { EntityGuard } from '../../../shared/application/ports/entity-guard';
import { Race } from '../../domain/aggregates/race';

export type RaceGuardPort = EntityGuard<Race>;
