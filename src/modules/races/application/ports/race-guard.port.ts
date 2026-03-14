import { EntityGuard } from 'src/modules/shared/application/ports/entity-guard';
import { Race } from '../../domain/aggregates/race';

export type RaceGuardPort = EntityGuard<Race>;
