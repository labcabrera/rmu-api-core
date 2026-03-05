export interface RealmGuardPort {
  checkCreateRealm(userId: string, roles: string[]): Promise<boolean>;
}
