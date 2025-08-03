export class Configuration {
  constructor(
    public readonly port: number = parseInt(process.env.PORT || '3001'),
    public readonly mongoUri: string = process.env.RMU_MONGO_CORE_URI!,
    public readonly keycloakUrl: string = process.env.RMU_KEYCLOAK_BASE_URL!,
    public readonly keycloakRealm: string = process.env.RMU_KEYCLOAK_REALM!,
    public readonly keycloakClientId: string = process.env.RMU_KEYCLOAK_CLIENT_ID!
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
