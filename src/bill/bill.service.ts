import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseBillDto } from './dtos/bill.dto';
import { UserInfo } from 'src/user/decorators/user.decorator';

const billSelected = {
  id: true,
  total: true,
  isPaid: true,
  status: true,
  createdAt: true,
  updatedAt: true,
};
@Injectable()
export class BillService {
  constructor(private readonly prismaService: PrismaService) {}
  async getAllBills(): Promise<ResponseBillDto[]> {
    const bills = await this.prismaService.bill.findMany({
      select: {
        ...billSelected,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    const data = bills.map((bill) => {
      return new ResponseBillDto(bill);
    });

    return data;
  }
  async getBillById(id: number): Promise<ResponseBillDto> {
    const bill = await this.prismaService.bill.findUnique({
      where: {
        id,
      },
      select: {
        ...billSelected,
        product: {
          select: {
            warehouse: {
              select: {
                shoe: {
                  select: {
                    id: true,
                    name: true,
                    price: true,
                    sale: true,
                  },
                },
                size: {
                  select: {
                    size_value: true,
                  },
                },
              },
            },
            qty: true,
          },
        },

        user: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
    });

    return new ResponseBillDto({
      ...bill,
      product: bill?.product?.map((item) => {
        return {
          ...item?.warehouse?.shoe,
          ...item?.warehouse?.size,
          qty: item.qty,
        };
      }),
    });
  }
}
