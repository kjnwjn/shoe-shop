import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseShoeDto } from './dtos/shoe.dto';

const shoeSelected = {
  id: true,
  name: true,
  description: true,
  size: true,
  price: true,
  categoryId: true,
  sale: true,
};
@Injectable()
export class ShoeService {
  constructor(private readonly prismaService: PrismaService) {}
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
      },
      orderBy: sortValue,
    });
    if (!shoeList.length) throw new NotFoundException();
    return shoeList.map((shoe) => {
      const fetchShoeImages = { ...shoe, image: shoe.images[0].url };
      delete fetchShoeImages.images;
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
      },
    });
    if (!shoe) throw new NotFoundException();
    return new ResponseShoeDto(shoe);
  }
}
