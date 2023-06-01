import { Exclude } from 'class-transformer';
import { IsNumber, IsPositive } from 'class-validator';

export class ResponseBillDto {
  id: number;
  product: any;
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
