import 'reflect-metadata';

// Configurar variables de entorno para tests ANTES de cualquier import
process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = 'silent';
process.env.PORT = '3001';
process.env.RMU_MONGO_CORE_URI = 'mongodb://test:test@localhost:27017/rmu-test';
process.env.CORS_ORIGIN = '*';
process.env.RMU_KEYCLOAK_BASE_URL = 'http://localhost:8090';
process.env.RMU_KEYCLOAK_REALM = 'rmu-test';
process.env.RMU_KEYCLOAK_CLIENT_ID = 'rmu-test-client';
process.env.RMU_KAFKA_BROKERS = 'localhost:9092';
process.env.RMU_KAFKA_PARTITION_COUNT = '2';
process.env.RMU_KAFKA_REPLICATION_FACTOR = '1';
process.env.RMU_KAFKA_RETENTION_MS = '604800000';
process.env.RMU_KAFKA_COMPRESSION_TYPE = 'snappy';

// Mock para module-alias
jest.mock('module-alias/register', () => {});

// Mock del logger para evitar problemas de Pino en tests
jest.mock('@infrastructure/logger/pino-logger', () => ({
  PinoLogger: jest.fn().mockImplementation(() => ({
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
  }))
}));

// Mock de Kafka para tests
jest.mock('kafkajs', () => ({
  Kafka: jest.fn().mockImplementation(() => ({
    producer: jest.fn().mockReturnValue({
      connect: jest.fn().mockResolvedValue(undefined),
      send: jest.fn().mockResolvedValue(undefined),
      disconnect: jest.fn().mockResolvedValue(undefined)
    })
  }))
}));
