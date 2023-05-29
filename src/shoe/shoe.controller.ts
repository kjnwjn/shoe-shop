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
  UseGuards,
} from '@nestjs/common';
import { ShoeService } from './shoe.service';
import {
  CreateNewShoeDto,
  ResponseShoeDto,
  UpdateShoeDto,
} from './dtos/shoe.dto';
import { User, UserInfo } from 'src/user/decorators/user.decorator';
import { AuthGuard } from 'src/guards/author.guard';
import { Role as UserType } from '@prisma/client';
import { Roles } from 'src/decorators/role.decorator';

@Controller('shoe')
export class ShoeController {
  constructor(private readonly shoeService: ShoeService) {}
  @Roles(UserType.ADMIN_ROLE, UserType.USER_ROLE)
  @Get()
  getShoes(@Query('sort') sort?: string): Promise<ResponseShoeDto[]> {
    return this.shoeService.getShoes(sort);
  }
  @Get(':id')
  getShoeById(@Param('id', ParseIntPipe) id: number) {
    return this.shoeService.getShoeById(id);
  }

  @Roles(UserType.ADMIN_ROLE)
  // @UseGuards(AuthGuard)
  @Post()
  createNewShoe(@Body() body: CreateNewShoeDto, @User() user: UserInfo) {
    // console.log(user);

    return 'createNewShoe';
    // return this.shoeService.createNewShoe(body);
  }
  @Put(':id')
  updateShoeById(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateShoeDto,
  ) {
    return 'update shoe';
    // return this.shoeService.updateShoeById(id, body);
  }
  @Delete(':id')
  deleteShoeById() {}
}
