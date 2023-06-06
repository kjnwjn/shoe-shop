import { Injectable, NotFoundException, HttpCode } from '@nestjs/common';
import { UserInfo } from 'src/user/decorators/user.decorator';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseBillDto } from 'src/user/dtos/bill.dto';
import { take } from 'rxjs';

const userSelect = {
  id: true,
  name: true,
  email: true,
};

const billsSelected = {
  id: true,
  total: true,
  isPaid: true,
  status: true,
  createdAt: true,
  updatedAt: true,
};
@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}
  async getUserById({ id }: UserInfo) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
      select: userSelect,
    });
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return user;
  }
  async getBillsByUserId(userData: UserInfo): Promise<ResponseBillDto[]> {
    const user = await this.getUserById(userData);
    const bills = await this.prismaService.bill.findMany({
      select: {
        ...billsSelected,
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
                    images: {
                      select: {
                        url: true,
                      },
                      take: 1,
                    },
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
          },
        },
      },
      where: {
        AND: {
          userId: user.id,
          status: 'PAID',
        },
      },
    });
    if (!bills?.length)
      throw new NotFoundException(
        `User ${user.name} does not have any bill before `,
      );
    return bills.map((bill) => {
      const product = bill?.product?.map((item) => {
        const data = {
          ...item?.warehouse?.shoe,
          ...item?.warehouse?.size,
          image: item?.warehouse?.shoe?.images[0]?.url,
          qty: item.qty,
        };

        delete data.images;
        return data;
      });
      return new ResponseBillDto({
        ...bill,
        product: product,
      });
    });
  }
}
