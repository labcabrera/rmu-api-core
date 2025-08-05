import { env } from "./env";

export const config = {
  port: env.PORT,
  mongoUri: env.RMU_MONGO_CORE_URI,
  corsOrigin: env.CORS_ORIGIN,
  keycloak: {
    clientId: env.RMU_KEYCLOAK_CLIENT_ID,
    baseUrl: env.RMU_KEYCLOAK_BASE_URL,
    realm: env.RMU_KEYCLOAK_REALM,
  },
  kafka: {
    brokers: env.RMU_KAFKA_BROKERS.split(","),
    partitionCount: env.RMU_KAFKA_PARTITION_COUNT,
    replicationFactor: env.RMU_KAFKA_REPLICATION_FACTOR,
    retentionMs: env.RMU_KAFKA_RETENTION_MS,
    compressionType: env.RMU_KAFKA_COMPRESSION_TYPE
  }
};
