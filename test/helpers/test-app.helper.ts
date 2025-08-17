// test/helpers/test-app.helper.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export class TestAppHelper {
  static async createTestApp(mockModels: Record<string, any> = {}): Promise<INestApplication> {
    const moduleBuilder = Test.createTestingModule({
      imports: [AppModule],
    });

    // Override model providers if provided
    if (mockModels.RealmModel) {
      moduleBuilder.overrideProvider(getModelToken('Realm')).useValue(mockModels.RealmModel);
    }
    if (mockModels.RaceModel) {
      moduleBuilder.overrideProvider(getModelToken('Race')).useValue(mockModels.RaceModel);
    }

    const moduleFixture: TestingModule = await moduleBuilder.compile();
    const app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
        whitelist: true,
        forbidNonWhitelisted: false,
      }),
    );

    await app.init();
    return app;
  }

  static createMockModel(mockData: any[] = []): Partial<Model<any>> {
    const mockModel = {
      find: jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockData),
          }),
        }),
        exec: jest.fn().mockResolvedValue(mockData),
      }),
      findById: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockData[0]),
      }),
      findOne: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockData[0]),
      }),
      create: jest.fn().mockResolvedValue(mockData[0]),
      save: jest.fn().mockResolvedValue(mockData[0]),
      updateOne: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
      deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }),
      countDocuments: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockData.length),
      }),
      aggregate: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([
          {
            _id: null,
            count: mockData.length,
            data: mockData,
          },
        ]),
      }),
    };

    return mockModel;
  }

  static createMockUser(overrides: Partial<any> = {}) {
    return {
      id: 'test-user-id',
      email: 'test@example.com',
      roles: ['user'],
      ...overrides,
    };
  }

  static createMockJwtGuard() {
    return {
      canActivate: jest.fn(() => true),
      getRequest: jest.fn().mockReturnValue({
        user: TestAppHelper.createMockUser(),
      }),
    };
  }
}
