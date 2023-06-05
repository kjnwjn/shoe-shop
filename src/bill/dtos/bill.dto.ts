import { Exclude, Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  ValidateNested,
} from 'class-validator';

export class ResponseBillDto {
  id: number;
  product?: any;
  total: number;
  isPaid: boolean;
  status: string;
  user: any;
  createdAt: Date;
  updatedAt: Date;
  constructor(partial: Partial<ResponseBillDto>) {
    Object.assign(this, partial);
  }
}
class Product {
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  id: number;
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  sizeId: number;
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  qty: number;
}
export class CreateNewBillDto {
  userId: number;
  total: number;
  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => Product)
  // product: any;
  // constructor(partial: Partial<ResponseBillDto>) {
  //   Object.assign(this, partial);
  // }
}
