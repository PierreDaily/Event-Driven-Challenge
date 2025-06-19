import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  const userServiceMock = {
    createUser: jest.fn((email: string) => ({ id: 'mock-id', email })),
    findUserByEmail: jest.fn(() => new Promise((resolve) => resolve(null))),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: userServiceMock,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser method', () => {
    const email = 'any@email.com';
    it('should call userService with the email address', async () => {
      await controller.createUser({ email });
      expect(userServiceMock.createUser).toHaveBeenCalledWith(email);
    });
    it('should return the new user', async () => {
      const user = await controller.createUser({ email });
      expect(user).toEqual({ id: 'mock-id', email });
    });
    it('should throw an error if the user with the same email already exist', async () => {
      userServiceMock.findUserByEmail.mockResolvedValueOnce({
        id: 'mock-uuid',
        email: 'test@test.com',
      });
      await expect(controller.createUser({ email })).rejects.toThrow(
        new Error(`User with email ${email} already exist`),
      );
    });
  });

  describe('findUserByEmail method', () => {
    const email = 'one.user@test.com';
    const newUser = { email, id: 'mock-id' };
    it('should return the user if the user exist', async () => {
      userServiceMock.findUserByEmail.mockResolvedValueOnce(newUser);
      const user = await controller.findUserByEmail(email);
      expect(user).toEqual(newUser);
    });
    it("should throw an error if the doesn't not exist", async () => {
      userServiceMock.findUserByEmail.mockResolvedValueOnce(null);
      await expect(controller.findUserByEmail(email)).rejects.toThrow(
        new Error(`User with email ${email} doesn't exist`),
      );
    });
  });
});
