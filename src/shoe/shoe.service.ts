import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpCode,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseShoeDto } from './dtos/shoe.dto';
import { WarehouseService } from 'src/warehouse/warehouse.service';
const shoeSelected = {
  id: true,
  name: true,
  description: true,
  price: true,
  categoryId: true,
  sale: true,
};
interface CreateShoeParams {
  name: string;
  description: string;
  price: number;
  sale?: number;
  categoryId: number;
  size: { sizeId: number; qty: number }[];
  images: { url: string }[];
}
interface UpdateShoeParams {
  name?: string;
  description?: string;
  price?: number;
  sale?: number;
  categoryId?: number;
}

@Injectable()
export class ShoeService {
  constructor(
    private readonly prismaService: PrismaService, // private readonly warehouseService: WarehouseService,
  ) {}
  async getShoes(sort?: string): Promise<ResponseShoeDto[]> {
    let sortValue: Object;
    if (sort == 'newest') {
      sortValue = { createdAt: 'desc' };
    } else if (sort == 'priceDesc') {
      sortValue = { price: 'desc' };
    } else if (sort == 'priceAsc') {
      sortValue = { price: 'asc' };
    } else {
      sortValue = { id: 'desc' };
    }
    const shoeList = await this.prismaService.shoe.findMany({
      select: {
        ...shoeSelected,
        images: {
          select: {
            url: true,
          },
          take: 1,
        },
        size: {
          select: {
            sizeId: true,
            qty: true,
          },
        },
      },
      orderBy: sortValue,
    });

    if (!shoeList.length) throw new NotFoundException();

    return shoeList.map((shoe) => {
      let qty: number;
      if (shoe?.size?.length > 0) {
        qty = shoe.size.reduce((sum, item) => (sum += item.qty), 0);
      }
      const fetchShoeImages = { ...shoe, image: shoe?.images[0]?.url, qty };
      delete fetchShoeImages.images;
      delete fetchShoeImages.size;
      return new ResponseShoeDto(fetchShoeImages);
    });
  }
  async getShoeById(id: number) {
    const shoe = await this.prismaService.shoe.findUnique({
      where: {
        id,
      },
      select: {
        ...shoeSelected,
        images: {
          select: {
            url: true,
          },
        },
        size: {
          select: {
            sizeId: true,
            qty: true,
          },
        },
      },
    });
    if (!shoe) throw new NotFoundException();
    let qty: number;
    if (shoe?.size?.length > 0) {
      qty = shoe.size.reduce((sum, item) => (sum += item.qty), 0);
    }
    const fetchShoeImages = { ...shoe, qty };
    return new ResponseShoeDto(fetchShoeImages);
  }
  async createNewShoe({
    name,
    description,
    price,
    sale,
    size,
    categoryId,
    images,
  }: CreateShoeParams) {
    const categoryExist = await this.prismaService.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!categoryExist)
      throw new NotFoundException({
        status: false,
        statusCode: 404,
        description: `categoryId :${categoryId} is not exit`,
      });
    const shoe = await this.prismaService.shoe.create({
      data: {
        name,
        description,
        price,
        sale,
        categoryId,
      },
    });
    const shoeImage = images.map((image) => {
      return { ...image, shoeId: shoe.id };
    });

    // await this.warehouseService.createNew({shoe})
    await this.prismaService.images.createMany({
      data: shoeImage,
      skipDuplicates: true,
    });

    return new ResponseShoeDto(shoe);
  }
  async updateShoeById(id: number, data: UpdateShoeParams) {
    const shoe = await this.prismaService.shoe.findUnique({
      where: {
        id,
      },
    });
    if (!shoe) throw new NotFoundException();
    const shoeUpdated = await this.prismaService.shoe.update({
      where: {
        id,
      },
      data: data,
    });
    return new ResponseShoeDto(shoeUpdated);
  }
  async deleteShoeById(id: number): Promise<HttpException> {
    const shoe = await this.prismaService.shoe.findUnique({
      where: {
        id,
      },
    });

    if (!shoe) throw new NotFoundException();
    try {
      await this.prismaService.images.deleteMany({
        where: {
          shoeId: id,
        },
      });
      await this.prismaService.warehouse.deleteMany({
        where: {
          shoeId: id,
        },
      });
      await this.prismaService.shoe.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new HttpException(`Internal server error`, error);
    }
    throw new HttpException(`Delete shoe ${id} Successfully`, 200);
  }
}
