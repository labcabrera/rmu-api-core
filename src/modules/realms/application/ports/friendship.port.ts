export const FRIENDSHIP_PORT = Symbol('FriendshipPort');

/** The other user of an accepted friendship, with the name users knows them by. */
export interface Friend {
  userId: string;
  userName: string;
}

/** Friendships of users (spec 069): a realm is only shared with an accepted friend of its owner. */
export interface FriendshipPort {
  /** `userB` as a friend of `userA` when they have an accepted friendship (either direction); null otherwise. */
  findAcceptedFriend(userA: string, userB: string): Promise<Friend | null>;
}
