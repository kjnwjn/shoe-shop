import { Controller, Get } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from 'src/decorators/role.decorator';
import { BillService } from './bill.service';

@Controller('bill')
export class BillController {
  constructor(private readonly billService: BillService) {}
  //   @Roles(Role.ADMIN_ROLE)
  @Get()
  getAllBills() {
    return this.billService.getAllBills();
  }
}
