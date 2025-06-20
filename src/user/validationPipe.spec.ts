import { UserService } from './user.service';
import { UserValidationPipe } from './validationPipe';

describe('UserValidationPipe', () => {
  let userServiceMock: Partial<Record<keyof UserService, jest.Mock>>;
  beforeEach(() => {
    userServiceMock = {
      findUserByEmail: jest.fn(() => new Promise((resolve) => resolve(null))),
    };
  });

  it('should return the same value if the email is valid and unique', async () => {
    // @ts-expect-error ssdsds
    const pipe = new UserValidationPipe(userServiceMock);
    expect(await pipe.transform({ email: 'test1@test.com' })).toEqual({
      email: 'test1@test.com',
    });
    expect(userServiceMock.findUserByEmail).toHaveBeenNthCalledWith(
      1,
      'test1@test.com',
    );
  });
  it('should throw if the user email address already exist', async () => {
    userServiceMock.findUserByEmail?.mockResolvedValueOnce({
      id: 'mock-id',
      email: 'test2@test.com',
    });
    // @ts-expect-error ssdsds
    const pipe = new UserValidationPipe(userServiceMock);
    await expect(pipe.transform({ email: 'test2@test.com' })).rejects.toThrow();
    expect(userServiceMock.findUserByEmail).toHaveBeenNthCalledWith(
      1,
      'test2@test.com',
    );
  });
  it("should throw if the input isn't a valid email address", async () => {
    // @ts-expect-error ssdsds
    const pipe = new UserValidationPipe(userServiceMock);
    await expect(
      pipe.transform({ email: 'invalidEmailAddress' }),
    ).rejects.toThrow();
    expect(userServiceMock.findUserByEmail).toHaveBeenCalledTimes(0);
  });
});
