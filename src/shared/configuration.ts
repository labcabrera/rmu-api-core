export class Configuration {
  constructor(
    public readonly port: number = parseInt(process.env.PORT || '3001'),
    public readonly mongoUri: string = process.env.RMU_MONGO_CORE_URI!,
    public readonly keycloakUrl: string = process.env.RMU_KEYCLOAK_BASE_URL!,
    public readonly keycloakRealm: string = process.env.RMU_KEYCLOAK_REALM!,
    public readonly keycloakClientId: string = process.env.RMU_KEYCLOAK_CLIENT_ID!,
    public readonly kafkaBrokers: string = process.env.RMU_KAFKA_BROKERS || 'localhost:9092',
    public readonly kafkaPartitionCount: number = parseInt(
      process.env.RMU_KAFKA_PARTITION_COUNT || '2'
    ),
    public readonly kafkaReplicationFactor: number = parseInt(
      process.env.RMU_KAFKA_REPLICATION_FACTOR || '1'
    ),
    public readonly kafkaRetentionMs: number = parseInt(
      process.env.RMU_KAFKA_RETENTION_MS || '604800000'
    ),
    public readonly kafkaCompressionType: 'gzip' | 'snappy' | 'lz4' | 'zstd' = (process.env
      .RMU_KAFKA_COMPRESSION_TYPE as any) || 'snappy'
  ) {
    //TODO remove this trace
    console.log(`Configuration initialized with port: ${JSON.stringify(this)}`);
  }

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
