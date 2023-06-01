import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from 'src/decorators/role.decorator';
import { BillService } from './bill.service';
import { ResponseBillDto } from './dtos/bill.dto';

@Controller('bill')
export class BillController {
  constructor(private readonly billService: BillService) {}
  //   @Roles(Role.ADMIN_ROLE)
  @Get()
  getAllBills(): Promise<ResponseBillDto[]> {
    return this.billService.getAllBills();
  }
  @Get('/:id')
  getBillById(@Param('id', ParseIntPipe) id: number): Promise<ResponseBillDto> {
    return this.billService.getBillById(id);
  }
}
