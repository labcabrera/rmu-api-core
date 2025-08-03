import { AuthenticatedCommand } from "./authenticated-command";

export interface CreateRealmCommand extends AuthenticatedCommand {
  readonly id: string;
  readonly name: string;
}
