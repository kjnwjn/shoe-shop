import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Res,
  Query,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from 'src/decorators/role.decorator';
import { BillService } from './bill.service';
import { CreateNewBillDto, ResponseBillDto } from './dtos/bill.dto';
import { User, UserInfo } from 'src/user/decorators/user.decorator';

@Controller('bill')
export class BillController {
  constructor(private readonly billService: BillService) {}
  @Roles(Role.ADMIN_ROLE)
  @Get()
  getAllBills(): Promise<ResponseBillDto[]> {
    return this.billService.getAllBills();
  }
  @Get('/:id')
  getBillById(@Param('id', ParseIntPipe) id: number): Promise<ResponseBillDto> {
    return this.billService.getBillById(id);
  }
  @Post('/payment')
  createNewBill(@Body() body, @User() user: UserInfo) {
    return this.billService.createNewBill(user, body);
  }
  @Get('/payment/success/:bill_id/')
  paymentSuccess(
    @Param('bill_id', ParseIntPipe) bill_id: number,
  ): Promise<ResponseBillDto> {
    return this.billService.paymentSuccess(bill_id);
  }
}
