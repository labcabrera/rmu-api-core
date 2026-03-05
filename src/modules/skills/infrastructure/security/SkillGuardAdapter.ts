import { SkillGuardPort } from '../../application/ports/skill-guard';
import { ForbiddenError } from 'src/modules/shared/domain/errors/errors';

export class SkillGuardAdapter implements SkillGuardPort {
  checkSkillCreation(userId: string, userRoles: string[]) {
    if (!userRoles.includes('rmu-admin')) {
      throw new ForbiddenError('You do not have permission to create a skill');
    }
  }
}
