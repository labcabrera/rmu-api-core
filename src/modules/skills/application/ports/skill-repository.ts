import { BaseRepository } from 'src/modules/shared/application/ports/repository';
import { Skill } from 'src/modules/skills/domain/aggregates/skill';

export type SkillRepository = BaseRepository<Skill>;
