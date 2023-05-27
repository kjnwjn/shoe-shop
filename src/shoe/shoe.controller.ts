import {
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
import { ResponseShoeDto } from './dtos/shoe.dto';
import { query } from 'express';

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
  createNewShoe() {}
  @Put(':id')
  updateShoeById() {}
  @Delete(':id')
  deleteShoeById() {}
}
