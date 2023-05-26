import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ShoeService {
  constructor(private readonly prismaService: PrismaService) {}
  async getShoes() {
    const shoeList = await this.prismaService.shoe.findMany();
    return shoeList;
  }
}
