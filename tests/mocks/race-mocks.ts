// Sample data para tests
export const sampleRace = {
  id: 'test-race',
  name: 'Test Race',
  realm: 'test-realm',
  description: 'A test race',
  defaultStatBonus: {
    ag: 0, co: 0, em: 0, in: 0, me: 0,
    pr: 0, qu: 0, re: 0, sd: 0, st: 0
  },
  createdAt: new Date(),
  updatedAt: new Date()
};

export const sampleRacePage = {
  content: [sampleRace],
  pagination: {
    page: 0,
    size: 10,
    totalElements: 1,
    totalPages: 1
  }
};

export const mockRaceService = {
  findById: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  deleteById: jest.fn()
};

export const mockCreateRaceUseCase = {
  execute: jest.fn(),
  existsById: jest.fn()
};

export const mockDeleteRaceUseCase = {
  execute: jest.fn()
};

export const mockUpdateRaceUseCase = {
  execute: jest.fn()
};
