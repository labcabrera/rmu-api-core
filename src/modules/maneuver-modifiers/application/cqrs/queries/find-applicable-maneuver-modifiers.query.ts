import { AuthenticatedCommand } from '../../../../shared/application/cqrs/authenticated-command';

/** Modifiers that apply to a skill (its own and those of its category) or to a category. */
export class FindApplicableManeuverModifiersQuery extends AuthenticatedCommand {
  constructor(
    public readonly skillId: string | undefined,
    public readonly categoryId: string | undefined,
    userId: string,
    roles: string[],
  ) {
    super(userId, roles);
  }
}
