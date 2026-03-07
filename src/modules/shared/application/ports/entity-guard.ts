export interface EntityGuard<E> {
  checkCreate(roles: string[]);

  checkUpdate(entity: E, userId: string, roles: string[]);
}
