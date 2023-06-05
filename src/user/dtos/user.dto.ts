import { Exclude } from 'class-transformer';

export class ResponseBillDto {
  id: number;
  product: any;
  total: number;
  isPaid: boolean;
  status: string;
  @Exclude()
  user: any;
  createdAt: Date;
  updatedAt: Date;
  constructor(partial: Partial<ResponseBillDto>) {
    Object.assign(this, partial);
  }
}
