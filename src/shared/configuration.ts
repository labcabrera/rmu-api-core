
export class Configuration {

 constructor(
    public readonly port: number = parseInt(process.env.PORT || '3001', 10),
    public readonly mongoUri: string = process.env.RMU_MONGO_CORE_URI || 'mongodb://admin:admin@localhost:27017/rmu-core?authSource=admin',
    public readonly keycloakUrl: string = process.env.KEYCLOAK_URL || 'http://localhost:8090',
    public readonly keycloakRealm: string = process.env.KEYCLOAK_REALM || 'rmu-local',
    public readonly keycloakClientId: string = process.env.KEYCLOAK_CLIENT_ID || 'rmu-client'
  ) {}

  public maskStdUrl(url: string): string {
  try {
    const u = new URL(url);
    if (u.username) u.username = '***';
    if (u.password) u.password = '***';
    return u.toString();
  } catch {
    return url;
  }
}
}