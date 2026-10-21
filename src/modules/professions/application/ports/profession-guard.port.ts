import { EntityGuard } from '../../../shared/application/ports/entity-guard';
import { Profession } from '../../domain/aggregates/profession';

export type ProfessionGuardPort = EntityGuard<Profession>;
