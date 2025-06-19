import {
  Body,
  Controller,
  Get,
  Post,
  ConflictException,
  UsePipes,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ZodValidationPipe } from 'nestjs-zod';
import { CreateUserDto } from './user.dto';

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
  @UsePipes(ZodValidationPipe)
  async createUser(@Body() body: CreateUserDto) {
    const user = await this.userService.findUserByEmail(body.email);
    if (user)
      throw new ConflictException(
        `User with email ${body.email} already exist`,
      );
    return this.userService.createUser(body.email);
  }
}
