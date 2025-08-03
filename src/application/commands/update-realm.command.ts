import { AuthenticatedCommand } from './authenticated-command';

export interface UpdateRealmCommand extends AuthenticatedCommand {
  readonly id: string;
  readonly name?: string;
}
