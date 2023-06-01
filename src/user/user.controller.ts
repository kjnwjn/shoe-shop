import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { User, UserInfo } from './decorators/user.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('/profile')
  getProfile(@User() user: UserInfo) {
    return this.userService.getUserById(user);
  }
  @Get('/purchase')
  getBillsByUserId(@User() user: UserInfo) {
    return this.userService.getBillsByUserId(user);
  }
}
