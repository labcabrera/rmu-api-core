export interface EntityGuard<E> {
  checkCreate(roles: string[]);

  checkRead(entity: E, userId: string, roles: string[]);

  checkUpdate(entity: E, userId: string, roles: string[]);

  checkDelete(entity: E, userId: string, roles: string[]);
}
