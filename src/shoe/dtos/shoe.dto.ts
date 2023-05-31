// import { IsOptional } from '@nestjs/common';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Validate,
  ValidateNested,
} from 'class-validator';
class Warehouse {
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  sizeId: number;
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  qty: number;
}
export class ResponseShoeDto {
  id: number;
  name: string;
  @Exclude()
  description: string;
  @Expose({ name: 'desc' })
  desc() {
    return this.description;
  }
  sale: number;
  price: number;
  @Exclude()
  @Expose({ name: 'type' })
  type() {
    return this.categoryId;
  }
  categoryId: number;
  image: string;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Warehouse)
  size: Warehouse[];
  qty: number;
  @Exclude()
  createdAt: Date;
  @Exclude()
  updatedAt: Date;

  constructor(partial: Partial<ResponseShoeDto>) {
    Object.assign(this, partial);
  }
}

class Image {
  @IsString()
  @IsNotEmpty()
  url: string;
}
export class CreateNewShoeDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  description: string;
  @IsNumber()
  @IsPositive()
  price: number;
  @IsOptional()
  sale: number;
  @IsNumber()
  @IsPositive()
  categoryId: number;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Warehouse)
  size: Warehouse[];
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Image)
  images: Image[];
}

export class UpdateShoeDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsOptional()
  @IsString()
  description: string;
  @IsOptional()
  @IsNumber()
  @IsPositive()
  price: number;
  @IsOptional()
  sale: number;
  @IsOptional()
  @IsNumber()
  @IsPositive()
  categoryId: number;
  // @IsOptional()
  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => Warehouse)
  // size: Warehouse[]
}
