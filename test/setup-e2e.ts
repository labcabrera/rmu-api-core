// test/setup-e2e.ts
import 'reflect-metadata';

// Configurar variables de entorno para tests E2E
process.env.NODE_ENV = 'test';
process.env.PORT = '3001';
process.env.RMU_MONGO_CORE_URI = 'mongodb://localhost:27017/rmu-core-e2e-test';
process.env.RMU_IAM_JWK_URI = 'http://localhost:8090/realms/rmu-test/protocol/openid_connect/certs';
process.env.RMU_IAM_TOKEN_URI = 'http://localhost:8090/realms/rmu-test/protocol/openid_connect/token';
process.env.RMU_IAM_CLIENT_ID = 'rmu-api-core-test';
process.env.RMU_IAM_CLIENT_SECRET = 'test-secret';
process.env.RMU_KAFKA_BROKERS = 'localhost:9092';
process.env.RMU_KAFKA_CLIENT_ID = 'rmu-core-e2e-test';
process.env.RMU_KAFKA_DEFAULT_PARTITIONS = '1';

// Configurar timeouts para E2E
jest.setTimeout(60000);

// Configuración global para tests E2E
beforeAll(() => {
  // Aquí puedes agregar configuración global para E2E
  console.log('🧪 Starting E2E tests...');
});

afterAll(() => {
  // Cleanup global para E2E
  console.log('✅ E2E tests completed');
});

// Mock para evitar problemas con Kafka en tests
jest.mock('kafkajs', () => ({
  Kafka: jest.fn().mockImplementation(() => ({
    producer: jest.fn().mockReturnValue({
      connect: jest.fn().mockResolvedValue(undefined),
      disconnect: jest.fn().mockResolvedValue(undefined),
      send: jest.fn().mockResolvedValue(undefined),
    }),
    consumer: jest.fn().mockReturnValue({
      connect: jest.fn().mockResolvedValue(undefined),
      disconnect: jest.fn().mockResolvedValue(undefined),
      subscribe: jest.fn().mockResolvedValue(undefined),
      run: jest.fn().mockResolvedValue(undefined),
    }),
  })),
}));
