import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { ShoeService } from './shoe.service';

@Controller('shoe')
export class ShoeController {
  constructor(private readonly shoeService: ShoeService) {}
  @Get()
  getShoes() {
    return this.shoeService.getShoes();
  }
  @Get(':id')
  getShoeById() {}
  @Post('')
  createNewShoe() {}
  @Put(':id')
  updateShoeById() {}
  @Delete(':id')
  deleteShoeById() {}
}
