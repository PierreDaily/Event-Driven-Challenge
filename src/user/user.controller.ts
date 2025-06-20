import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { type CreateUserDto, UserValidationPipe } from './validationPipe';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findUserByEmail(email: string) {
    const user = await this.userService.findUserByEmail(email);
    if (user === null)
      throw new NotFoundException(`User with email ${email} doesn't exist`);
    return user;
  }
  @Post()
  @UsePipes(UserValidationPipe)
  async createUser(@Body() body: CreateUserDto) {
    return this.userService.createUser(body.email);
  }
}
