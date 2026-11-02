/**
 * A friendship ended (blocked or deleted in users): each user loses the access the other gave them (spec 069,
 * decision 7). It comes from Kafka, so it carries no user and checks no permission.
 */
export class RevokeSharesBetweenUsersCommand {
  constructor(
    public readonly userA: string,
    public readonly userB: string,
  ) {}
}
