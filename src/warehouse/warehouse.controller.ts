import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Query,
  Post,
} from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { ShoeUpdateQtyDto, WarehouseCreateDto } from './dtos/warehouse.dto';

@Controller('warehouse')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}
  @Get()
  getAll(@Query('sort') sort?: string) {
    return this.warehouseService.getAll();
  }
  @Put('/:shoeId')
  updateQtyShoe(
    @Param('shoeId', ParseIntPipe) shoeId: number,
    @Body() body: ShoeUpdateQtyDto,
  ) {
    return this.warehouseService.updateQtyShoe(shoeId, body);
  }
  @Post('/:shoeId')
  createNew(@Body() body: WarehouseCreateDto) {
    return this.warehouseService.createNew(body);
  }
}
