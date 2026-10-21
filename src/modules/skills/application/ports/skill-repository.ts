import { BaseRepository } from '../../../shared/application/ports/base-repository';
import { Skill } from '../../domain/aggregates/skill';

export type SkillRepository = BaseRepository<Skill>;
