import 'reflect-metadata';

// Mock para module-alias
jest.mock('module-alias/register', () => {});

// Setup global para tests
beforeAll(() => {
  // Configuración global antes de todos los tests
});

afterAll(() => {
  // Limpieza global después de todos los tests
});

beforeEach(() => {
  // Setup antes de cada test
  jest.clearAllMocks();
});

afterEach(() => {
  // Limpieza después de cada test
});
