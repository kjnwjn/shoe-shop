import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { BillService } from './bill.service';
import { BillController } from './bill.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { WarehouseModule } from 'src/warehouse/warehouse.module';
import { ShoeModule } from 'src/shoe/shoe.module';

@Module({
  imports: [PrismaModule, UserModule, WarehouseModule, ShoeModule],
  providers: [
    BillService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
  controllers: [BillController],
  exports: [BillService],
})
export class BillModule {}
