import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BillModule } from 'src/bill/bill.module';

@Module({
  imports: [PrismaModule],
  providers: [UserService, AuthService],
  controllers: [UserController, AuthController],
  exports: [UserService],
})
export class UserModule {}
