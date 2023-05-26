import { Controller, Delete, Get, Post, Put } from '@nestjs/common';

@Controller('shoe')
export class ShoeController {
  @Get()
  getAllShoes() {}
  @Get(':id')
  getShoeById() {}
  @Post('')
  createNewShoe() {}
  @Put(':id')
  updateShoeById() {}
  @Delete(':id')
  deleteShoeById() {}
}
