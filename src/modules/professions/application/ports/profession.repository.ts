import { Profession } from '../../domain/aggregates/profession';
import { BaseRepository } from '../../../shared/application/ports/base-repository';

export type ProfessionRepository = BaseRepository<Profession>;
