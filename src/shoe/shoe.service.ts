import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseShoeDto } from './dtos/shoe.dto';

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
        size: true,
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
  async createNewShoe({
    name,
    description,
    price,
    sale,
    categoryId,
    images,
  }: CreateShoeParams) {
    try {
      const shoe = await this.prismaService.shoe.create({
        data: {
          name,
          description,
          price,
          sale,
          categoryId: 1,
        },
      });
      const shoeImage = images.map((image) => {
        return { ...image, shoeId: shoe.id };
      });
      await this.prismaService.images.createMany({
        data: shoeImage,
        skipDuplicates: true,
      });
      return new ResponseShoeDto(shoe);
    } catch (err) {
      throw new Error(err);
    }
  }
  // async updateShoeById(id: number, data: UpdateShoeParams) {
  //   try {
  //     const shoe = await this.prismaService.shoe.findUnique({
  //       where: {
  //         id,
  //       },
  //     });
  //     if (!shoe) throw new NotFoundException();
  //     const shoeUpdated = await this.prismaService.shoe.update({
  //       where: {
  //         id,
  //       },
  //       data: data,
  //     });
  //     return new ResponseShoeDto(shoeUpdated);
  //   } catch (error) {
  //     throw new Error(error);
  //   }
  // }
}
