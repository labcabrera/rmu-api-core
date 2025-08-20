// test/setup.ts
import 'reflect-metadata';

// Configurar variables de entorno para tests
process.env.NODE_ENV = 'test';
process.env.RMU_MONGO_CORE_URI = 'mongodb://localhost:27017/rmu-core-test';
process.env.RMU_KEYCLOAK_BASE_URL = 'http://localhost:8090';
process.env.RMU_KEYCLOAK_REALM = 'rmu-test';
process.env.RMU_KEYCLOAK_CLIENT_ID = 'rmu-api-core-test';
process.env.RMU_KAFKA_BROKERS = 'localhost:9092';
process.env.RMU_KAFKA_CLIENT_ID = 'rmu-core-test';

// Configurar timeouts globales
jest.setTimeout(30000);

// Mock global para console en tests
const originalConsole = console;
global.console = {
  ...originalConsole,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Restaurar console después de cada test
afterEach(() => {
  jest.clearAllMocks();
});
