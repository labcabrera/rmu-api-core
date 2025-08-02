import 'reflect-metadata';
import { RaceService } from '@application/services/RaceService';
import { RaceRepository } from '@domain/ports/RaceRepository';
import { Race, CreateRaceRequest } from '@domain/entities/Race';
import { NotFoundError, ConflictError } from '@shared/types';

describe('RaceService', () => {
  let raceService: RaceService;
  let mockRaceRepository: jest.Mocked<RaceRepository>;

  beforeEach(() => {
    mockRaceRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      deleteById: jest.fn(),
      existsById: jest.fn(),
    };
    raceService = new RaceService(mockRaceRepository);
  });

  describe('findById', () => {
    it('should return race when ID exists', async () => {
      // Arrange
      const raceId = 'test-race';
      const expectedRace: Race = {
        id: raceId,
        name: 'Test Race',
        realm: 'test-realm',
        defaultStatBonus: {
          ag: 0,
          co: 0,
          em: 0,
          in: 0,
          me: 0,
          pr: 0,
          qu: 0,
          re: 0,
          sd: 0,
          st: 0,
        },
      };
      mockRaceRepository.findById.mockResolvedValue(expectedRace);

      // Act
      const result = await raceService.findById(raceId);

      // Assert
      expect(result).toEqual(expectedRace);
      expect(mockRaceRepository.findById).toHaveBeenCalledWith(raceId);
    });

    it('should throw NotFoundError when ID does not exist', async () => {
      // Arrange
      const raceId = 'non-existent-race';
      mockRaceRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(raceService.findById(raceId)).rejects.toThrow(NotFoundError);
      expect(mockRaceRepository.findById).toHaveBeenCalledWith(raceId);
    });
  });

  describe('create', () => {
    it('should create race when ID does not exist', async () => {
      // Arrange
      const createRequest: CreateRaceRequest = {
        id: 'new-race',
        name: 'New Race',
        realm: 'test-realm',
        defaultStatBonus: {
          ag: 0,
          co: 0,
          em: 0,
          in: 0,
          me: 0,
          pr: 0,
          qu: 0,
          re: 0,
          sd: 0,
          st: 0,
        },
      };
      const expectedRace: Race = { ...createRequest };

      mockRaceRepository.existsById.mockResolvedValue(false);
      mockRaceRepository.save.mockResolvedValue(expectedRace);

      // Act
      const result = await raceService.create(createRequest);

      // Assert
      expect(result).toEqual(expectedRace);
      expect(mockRaceRepository.existsById).toHaveBeenCalledWith(createRequest.id);
      expect(mockRaceRepository.save).toHaveBeenCalledWith(createRequest);
    });

    it('should throw ConflictError when ID already exists', async () => {
      // Arrange
      const createRequest: CreateRaceRequest = {
        id: 'existing-race',
        name: 'Existing Race',
        realm: 'test-realm',
        defaultStatBonus: {
          ag: 0,
          co: 0,
          em: 0,
          in: 0,
          me: 0,
          pr: 0,
          qu: 0,
          re: 0,
          sd: 0,
          st: 0,
        },
      };

      mockRaceRepository.existsById.mockResolvedValue(true);

      // Act & Assert
      await expect(raceService.create(createRequest)).rejects.toThrow(ConflictError);
      expect(mockRaceRepository.existsById).toHaveBeenCalledWith(createRequest.id);
      expect(mockRaceRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('deleteById', () => {
    it('should delete race when ID exists', async () => {
      // Arrange
      const raceId = 'test-race';
      mockRaceRepository.deleteById.mockResolvedValue(true);

      // Act
      await raceService.deleteById(raceId);

      // Assert
      expect(mockRaceRepository.deleteById).toHaveBeenCalledWith(raceId);
    });

    it('should throw NotFoundError when ID does not exist', async () => {
      // Arrange
      const raceId = 'non-existent-race';
      mockRaceRepository.deleteById.mockResolvedValue(false);

      // Act & Assert
      await expect(raceService.deleteById(raceId)).rejects.toThrow(NotFoundError);
      expect(mockRaceRepository.deleteById).toHaveBeenCalledWith(raceId);
    });
  });
});
