import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ShoeModule } from './shoe/shoe.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { UserInterceptor } from './user/interceptors/user.interceptor';
import { AuthGuard } from './guards/author.guard';
import { WarehouseModule } from './warehouse/warehouse.module';
import { RatingModule } from './rating/rating.module';
import { BillModule } from './bill/bill.module';
import { TestModule } from './test/test.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [
    UserModule,
    PrismaModule,
    ShoeModule,
    WarehouseModule,
    RatingModule,
    BillModule,
    TestModule,
    CartModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: UserInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
