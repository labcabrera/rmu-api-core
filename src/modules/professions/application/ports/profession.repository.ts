import { Profession } from '../../domain/aggregates/profession.js';
import type { BaseRepository } from '../../../shared/application/ports/base-repository.js';

export type ProfessionRepository = BaseRepository<Profession>;
