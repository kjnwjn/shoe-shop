import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BillService {
  constructor(private readonly prismaService: PrismaService) {}
  async getAllBills() {
    const bills = await this.prismaService.bill.findMany({
      select: {
        id: true,
        product: true,
      },
    });
    console.log(bills);

    return bills;
  }
}
