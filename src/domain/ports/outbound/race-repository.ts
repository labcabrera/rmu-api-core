import { RaceQuery } from '@domain/queries/race-query';
import { Repository } from './repository';
import { Race } from '@domain/entities/race';

export interface RaceRepository extends Repository<Race, RaceQuery> {}
