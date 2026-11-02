import { Profession } from '../../domain/aggregates/profession.js';
import type { BaseRepository } from '../../../shared/application/ports/base-repository.port.js';

export const PROFESSION_REPOSITORY = Symbol('ProfessionRepository');

export type ProfessionRepository = BaseRepository<Profession>;
