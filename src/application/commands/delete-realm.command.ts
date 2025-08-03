import { AuthenticatedCommand } from "./authenticated-command";

export interface DeleteRealmCommand extends AuthenticatedCommand {
  readonly id: string;
}
