import { Exclude, Expose, Type } from 'class-transformer';
import { IsArray, IsNumber, IsPositive, ValidateNested } from 'class-validator';
export class ShoeUpdateQtyDto {
  @IsNumber()
  @IsPositive()
  sizeId: number;
  @IsNumber()
  @IsPositive()
  qty: number;
}
class Warehouse {
  @IsNumber()
  @IsPositive()
  sizeId: number;
  @IsNumber()
  @IsPositive()
  qty: number;
}
export class WarehouseCreateDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Warehouse)
  size: Warehouse[];
  @IsNumber()
  @IsPositive()
  shoeId: number;
}
