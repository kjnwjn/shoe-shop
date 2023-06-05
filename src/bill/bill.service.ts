import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNewBillDto, ResponseBillDto } from './dtos/bill.dto';
import { UserInfo } from 'src/user/decorators/user.decorator';
import { UserService } from 'src/user/user.service';
import Stripe from 'stripe';
import { WarehouseService } from 'src/warehouse/warehouse.service';
import { ShoeService } from 'src/shoe/shoe.service';

const billSelected = {
  id: true,
  total: true,
  isPaid: true,
  status: true,
  createdAt: true,
  updatedAt: true,
};
interface paymentCheck {
  product: {
    id: number;
    sizeId: number;
    qty: number;
  }[];
}
interface paymentSelected {
  products: {
    priceId: number;
    quantity: number;
  }[];
}
interface ShoeMatches {
  userId: number;
  total: number;
}
@Injectable()
export class BillService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userSerVice: UserService,
    private readonly warehouseService: WarehouseService,
    private readonly shoeService: ShoeService,
  ) {}
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
  async createNewBill(
    userData: UserInfo,
    { product }: paymentCheck,
  ): Promise<ResponseBillDto> {
    const user = await this.userSerVice.getUserById(userData);
    const shoeList = await this.warehouseService.getAll();

    let shoeMatches: any[] = [];
    product.forEach((item) => {
      const checkShoeIndex = shoeList.findIndex(
        (shoe) =>
          shoe.shoe.id === item.id &&
          shoe.size.id === item.sizeId &&
          shoe.qty >= item.qty,
      );

      if (shoeList[checkShoeIndex] !== undefined) {
        shoeMatches.push({
          id: shoeList[checkShoeIndex].id,
          shoe: shoeList[checkShoeIndex]?.shoe,
          size: shoeList[checkShoeIndex]?.size,
          qty: item.qty,
        });
      }
    });
    const total: number = shoeMatches.reduce((sum, shoeMatch) => {
      console.log(sum, shoeMatch);

      return sum + shoeMatch?.shoe?.price * shoeMatch?.qty;
    }, 0);

    let data = {
      total,
      userId: user.id,
    };
    if (shoeMatches.length !== product.length) throw new ConflictException();
    const bills = await this.prismaService.bill.create({
      data,
    });
    console.log(bills);

    if (!bills) throw new ConflictException();
    const productData = shoeMatches.map((shoeMatch) => {
      return {
        warehouseId: shoeMatch?.id,
        sizeId: shoeMatch?.size?.id,
        qty: shoeMatch.qty,
      };
    });

    const session = await this.createPayment(
      shoeMatches,
      bills.id,
      productData,
    );
    return;
  }
  async createPayment(products, bill_id: number, product_data: any) {
    const stripe = new Stripe(process.env.STRIPE_TOKEN, {
      apiVersion: '2022-11-15',
    });
    try {
      const line_items = await Promise.all(
        products.map(async (item) => {
          const b = await stripe.prices.create({
            unit_amount: item.shoe.price,
            currency: 'VND',
            recurring: { interval: 'month' },
            product_data: { name: String(item.shoe.id) },
          });
          return { price: b.id, quantity: item.qty };
        }),
      );
      const session = await stripe.checkout.sessions.create({
        success_url: `http://localhost:3000/bill/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: 'http://localhost:3000/bill/payment/failed',
        line_items,
        mode: 'subscription',
        metadata: {
          bill_id: bill_id,
          product_data: product_data,
        },
      });
      console.log(session);

      return session;
    } catch (error) {
      throw new Error(error);
    }
  }
  async paymentSuccess(session_id: string, bill_id: string, user: UserInfo) {
    const stripe = new Stripe(process.env.STRIPE_TOKEN, {
      apiVersion: '2022-11-15',
    });
    const session = stripe.checkout.sessions
      .retrieve(session_id)
      .then((response) => console.log(response));
    // console.log(session);
  }
}
