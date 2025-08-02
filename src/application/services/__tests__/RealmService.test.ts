import 'reflect-metadata';
import { RealmService } from '@application/services/RealmService';
import { RealmRepository } from '@domain/ports/RealmRepository';
import { Realm, CreateRealmRequest } from '@domain/entities/Realm';
import { NotFoundError, ConflictError } from '@shared/types';

describe('RealmService', () => {
  let realmService: RealmService;
  let mockRealmRepository: jest.Mocked<RealmRepository>;

  beforeEach(() => {
    mockRealmRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      deleteById: jest.fn(),
      existsById: jest.fn(),
    };
    realmService = new RealmService(mockRealmRepository);
  });

  describe('findById', () => {
    it('should return realm when ID exists', async () => {
      // Arrange
      const realmId = 'test-realm';
      const expectedRealm: Realm = {
        id: realmId,
        name: 'Test Realm',
        description: 'A test realm for magical experiments',
      };
      mockRealmRepository.findById.mockResolvedValue(expectedRealm);

      // Act
      const result = await realmService.findById(realmId);

      // Assert
      expect(result).toEqual(expectedRealm);
      expect(mockRealmRepository.findById).toHaveBeenCalledWith(realmId);
    });

    it('should throw NotFoundError when ID does not exist', async () => {
      // Arrange
      const realmId = 'non-existent-realm';
      mockRealmRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(realmService.findById(realmId)).rejects.toThrow(NotFoundError);
      expect(mockRealmRepository.findById).toHaveBeenCalledWith(realmId);
    });
  });

  describe('create', () => {
    it('should create realm when ID does not exist', async () => {
      // Arrange
      const createRequest: CreateRealmRequest = {
        id: 'new-realm',
        name: 'New Realm',
        description: 'A newly created magical realm',
      };
      const expectedRealm: Realm = { ...createRequest };

      mockRealmRepository.existsById.mockResolvedValue(false);
      mockRealmRepository.save.mockResolvedValue(expectedRealm);

      // Act
      const result = await realmService.create(createRequest);

      // Assert
      expect(result).toEqual(expectedRealm);
      expect(mockRealmRepository.existsById).toHaveBeenCalledWith(createRequest.id);
      expect(mockRealmRepository.save).toHaveBeenCalledWith(createRequest);
    });

    it('should throw ConflictError when ID already exists', async () => {
      // Arrange
      const createRequest: CreateRealmRequest = {
        id: 'existing-realm',
        name: 'Existing Realm',
        description: 'A realm that already exists',
      };

      mockRealmRepository.existsById.mockResolvedValue(true);

      // Act & Assert
      await expect(realmService.create(createRequest)).rejects.toThrow(ConflictError);
      expect(mockRealmRepository.existsById).toHaveBeenCalledWith(createRequest.id);
      expect(mockRealmRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return paginated realms', async () => {
      // Arrange
      const realms: Realm[] = [
        { id: 'essence', name: 'Essence', description: 'Pure magical energy' },
        { id: 'channeling', name: 'Channeling', description: 'Divine magic' },
      ];
      const paginatedResult = {
        content: realms,
        pagination: { page: 0, size: 10, totalElements: 2 },
      };
      mockRealmRepository.findAll.mockResolvedValue(paginatedResult);

      // Act
      const result = await realmService.findAll({ page: 0, size: 10 });

      // Assert
      expect(result).toEqual(paginatedResult);
      expect(mockRealmRepository.findAll).toHaveBeenCalledWith({ page: 0, size: 10 });
    });
  });

  describe('deleteById', () => {
    it('should delete realm when ID exists', async () => {
      // Arrange
      const realmId = 'test-realm';
      mockRealmRepository.deleteById.mockResolvedValue(true);

      // Act
      await realmService.deleteById(realmId);

      // Assert
      expect(mockRealmRepository.deleteById).toHaveBeenCalledWith(realmId);
    });

    it('should throw NotFoundError when ID does not exist', async () => {
      // Arrange
      const realmId = 'non-existent-realm';
      mockRealmRepository.deleteById.mockResolvedValue(false);

      // Act & Assert
      await expect(realmService.deleteById(realmId)).rejects.toThrow(NotFoundError);
      expect(mockRealmRepository.deleteById).toHaveBeenCalledWith(realmId);
    });
  });
});
