import {
  PipeTransform,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { z } from 'zod';
import { UserService } from './user.service';

const createUserSchema = z.object({ email: z.string().email() });

@Injectable()
export class UserValidationPipe implements PipeTransform {
  constructor(private readonly userService: UserService) {}
  async transform(value: unknown) {
    const { data, error, success } = createUserSchema.safeParse(value);
    if (!success) throw new UnprocessableEntityException(error.formErrors);

    const user = await this.userService.findUserByEmail(data.email);
    if (user)
      throw new UnprocessableEntityException(
        `User with email ${data.email} already exist`,
      );
    return data;
  }
}

export type CreateUserDto = z.infer<typeof createUserSchema>;
