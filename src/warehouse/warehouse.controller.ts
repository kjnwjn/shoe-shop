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
import { Roles } from 'src/decorators/role.decorator';
import { Role as UserType } from '@prisma/client';

@Controller('warehouse')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}
  @Roles(UserType.ADMIN_ROLE)
  @Get()
  getAll(@Query('sort') sort?: string) {
    return this.warehouseService.getAll();
  }
  @Roles(UserType.ADMIN_ROLE)
  @Put('/:shoeId')
  updateQtyShoe(
    @Param('shoeId', ParseIntPipe) shoeId: number,
    @Body() body: ShoeUpdateQtyDto,
  ) {
    return this.warehouseService.updateQtyShoe(shoeId, body);
  }
  @Roles(UserType.ADMIN_ROLE)
  @Post('/:shoeId')
  createNew(@Body() body: WarehouseCreateDto) {
    return this.warehouseService.createNew(body);
  }
}
