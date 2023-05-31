import { Module, forwardRef } from '@nestjs/common';
import { WarehouseController } from './warehouse.controller';
import { WarehouseService } from './warehouse.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ShoeModule } from 'src/shoe/shoe.module';

@Module({
  imports: [PrismaModule, forwardRef(() => ShoeModule)],
  controllers: [WarehouseController],
  providers: [WarehouseService],
  exports: [WarehouseService],
})
export class WarehouseModule {}
