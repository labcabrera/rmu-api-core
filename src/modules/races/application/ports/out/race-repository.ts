import { Race } from 'src/modules/races/domain/aggregates/race';
import { Repository } from '../../../../core/application/ports/out/repository';

export type RaceRepository = Repository<Race>;
