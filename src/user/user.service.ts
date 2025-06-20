import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(email: string) {
    return this.prismaService.user.create({
      data: { email, id: uuidv4() },
    });
  }

  async deleteById(id: string): Promise<void> {
    await this.prismaService.user.delete({ where: { id } });
    return;
  }

  async findUserByEmail(
    email: string,
  ): Promise<{ id: string; email: string } | null> {
    return this.prismaService.user.findFirst({ where: { email } });
  }
}
