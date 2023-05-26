import { Module } from '@nestjs/common';
import { ShoeController } from './shoe.controller';
import { ShoeService } from './shoe.service';

@Module({
  controllers: [ShoeController],
  providers: [ShoeService]
})
export class ShoeModule {}
