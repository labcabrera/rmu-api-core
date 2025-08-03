import { AuthenticatedCommand } from './authenticated-command';

export interface DeleteRaceCommand extends AuthenticatedCommand {
  id: string;
}
