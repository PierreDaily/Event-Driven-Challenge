import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from '../prisma/prisma.module';
import { type DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-uuid'),
}));

describe('UserService', () => {
  let userService: UserService;

  let prismaMock: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    prismaMock = mockDeep<PrismaClient>();
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('create method', () => {
    it('should call prisma service to create a user entity with the correct details', async () => {
      await userService.createUser('test@test.com');
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: { email: 'test@test.com', id: 'mock-uuid' },
      });
    });

    it('should throw an error if  prisma service throw an error', async () => {
      prismaMock.user.create.mockRejectedValueOnce(new Error());
      await expect(userService.createUser('test@test.com')).rejects.toThrow();
    });
  });
});

describe('deleteById method', () => {
  let userService: UserService;

  let prismaMock: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    prismaMock = mockDeep<PrismaClient>();
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });
  it('should call prisma service to delete a user entity with the corresponding id', async () => {
    const result = await userService.deleteById('mock-uuid');
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(prismaMock.user.delete).toHaveBeenCalledWith({
      where: { id: 'mock-uuid' },
    });
    expect(result).toBeUndefined();
  });
  it('should throw an error if  prisma service throw an error', async () => {
    prismaMock.user.delete.mockRejectedValueOnce(new Error());
    await expect(userService.deleteById('mock-uuid')).rejects.toThrow();
  });
});

describe('findByEmail method', () => {
  let userService: UserService;

  let prismaMock: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    prismaMock = mockDeep<PrismaClient>();
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });
  it('should return the user from prisma service', async () => {
    prismaMock.user.findFirst.mockResolvedValueOnce({
      email: 'test@test.com',
      id: 'mock-uuid',
    });
    const result = await userService.findUserByEmail('test@test.com');
    expect(result).toEqual({ email: 'test@test.com', id: 'mock-uuid' });
  });

  it('should throw an error if prisma service throw an error', async () => {
    prismaMock.user.findFirst.mockRejectedValueOnce(new Error());
    await expect(
      userService.findUserByEmail('test@test.com'),
    ).rejects.toThrow();
  });
});
