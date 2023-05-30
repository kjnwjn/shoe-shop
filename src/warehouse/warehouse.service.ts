import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ShoeUpdateQtyDto, WarehouseCreateDto } from './dtos/warehouse.dto';
import { ResponseShoeDto } from 'src/shoe/dtos/shoe.dto';
import { ShoeService } from 'src/shoe/shoe.service';

@Injectable()
export class WarehouseService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly shoeService: ShoeService,
  ) {}
  async getAll(sort?: string) {
    let sortValue: Object;
    if (sort == 'newest') {
      sortValue = { createdAt: 'desc' };
    } else {
      sortValue = { shoeId: 'asc' };
    }
    const warehouseList = await this.prismaService.warehouse.findMany({
      select: {
        shoe: true,
        size: true,
        qty: true,
      },
      orderBy: sortValue,
    });
    if (warehouseList?.length < 0) throw new NotFoundException();
    return warehouseList;
  }
  async updateQtyShoe(shoeId: number, { sizeId, qty }: ShoeUpdateQtyDto) {
    const shoe = await this.prismaService.warehouse.findFirst({
      where: {
        shoeId,
        sizeId,
      },
    });
    if (!shoe) throw new NotFoundException();

    await this.prismaService.warehouse
      .updateMany({
        where: {
          size: {
            id: sizeId,
          },
          shoe: {
            id: shoeId,
          },
        },
        data: {
          qty: qty,
        },
      })
      .catch((err) => {
        console.log({ err });

        throw new InternalServerErrorException(err);
      });

    return {
      status: true,
      statusCode: 200,
      message: `Update qty for shoe ${shoeId} size ${sizeId} successfuly`,
    };
  }
  async createNew({ size, shoeId }: WarehouseCreateDto) {
    await this.shoeService.getShoeById(shoeId);
    // const size = await this.prismaService.size.findUnique({
    //   where: {
    //     id: sizeId,
    //   },
    // });
    // if (!size) {
    //   throw new NotFoundException(`Size ${sizeId} not found`);
    // }
    const shoe = await this.prismaService.warehouse.findMany({
      where: {
        shoeId,
      },
    });
    const data = size.map((item) => {
      return { ...item, shoeId };
    });
    console.log(data);

    if (shoe) {
      throw new ConflictException(`Shoe ${shoeId} already exists in warehouse`);
    }
    // const newItemInWareHouse = await this.prismaService.warehouse
    //   .createMany({
    //     data: {
    //       sizeId,
    //       shoeId,
    //       qty,
    //     },
    //   })
    //   .catch((err) => {
    //     console.log({ err });

    //     throw new InternalServerErrorException(err);
    //   });

    // return newItemInWareHouse;
    return;
  }
}
