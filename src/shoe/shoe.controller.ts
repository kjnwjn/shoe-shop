import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ShoeService } from './shoe.service';
import {
  CreateNewShoeDto,
  ResponseShoeDto,
  UpdateShoeDto,
} from './dtos/shoe.dto';

@Controller('shoe')
export class ShoeController {
  constructor(private readonly shoeService: ShoeService) {}
  @Get()
  getShoes(@Query('sort') sort?: string): Promise<ResponseShoeDto[]> {
    return this.shoeService.getShoes(sort);
  }
  @Get(':id')
  getShoeById(@Param('id', ParseIntPipe) id: number) {
    return this.shoeService.getShoeById(id);
  }
  @Post('')
  createNewShoe(@Body() body: CreateNewShoeDto) {
    return this.shoeService.createNewShoe(body);
  }
  @Put(':id')
  updateShoeById(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateShoeDto,
  ) {
    return this.shoeService.updateShoeById(id, body);
  }
  @Delete(':id')
  deleteShoeById() {}
}
