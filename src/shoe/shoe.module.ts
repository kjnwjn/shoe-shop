import { ClassSerializerInterceptor, Module, forwardRef } from '@nestjs/common';
import { ShoeController } from './shoe.controller';
import { ShoeService } from './shoe.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
// import { WarehouseModule } from 'src/warehouse/warehouse.module';

@Module({
  imports: [PrismaModule],
  controllers: [ShoeController],
  providers: [
    ShoeService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
  exports: [ShoeService],
})
export class ShoeModule {}
