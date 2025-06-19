import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserController } from './user.controller';

@Module({
  imports: [PrismaModule],
  providers: [UserService, PrismaService],
  controllers: [UserController],
})
export class UserModule {}
