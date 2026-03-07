import { ProfessionGuardPort } from '../../application/ports/profession-guard.port';

export class ProfessionGuardAdapter implements ProfessionGuardPort {
  checkCreate(roles: string[]) {
    if (!roles.includes('rmu-admin')) {
      throw new Error('Unauthorized');
    }
  }
}
