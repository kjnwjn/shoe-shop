import { Exclude, Expose } from 'class-transformer';
export class ResponseShoeDto {
  id: number;
  name: string;
  @Exclude()
  description: string;
  @Expose({ name: 'desc' })
  desc() {
    return this.description;
  }
  size: number[];
  sale: number;
  price: number;
  @Exclude()
  categoryId: number;
  @Expose({ name: 'type' })
  type() {
    return this.categoryId;
  }
  image: string;
  @Exclude()
  createdAt: Date;
  @Exclude()
  updatedAt: Date;

  constructor(partial: Partial<ResponseShoeDto>) {
    Object.assign(this, partial);
  }
}
