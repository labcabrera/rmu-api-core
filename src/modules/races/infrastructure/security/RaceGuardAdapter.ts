import { ForbiddenError } from 'src/modules/shared/domain/errors/errors';
import { RaceGuardPort } from '../../application/ports/race-guard.port';
import { Race } from '../../domain/aggregates/race';

export class RaceGuardAdapter implements RaceGuardPort {
  checkCreate(userId: string, roles: string[]) {
    if (!roles.includes('rmu-admin')) {
      throw new ForbiddenError('You do not have permission to create a race');
    }
  }
  checkUpdate(race: Race, userId: string, roles: string[]) {
    if (roles.includes('rmu-admin')) return;
    if (race.owner === userId) return;
    throw new ForbiddenError('You do not have permission to update this race');
  }
}
