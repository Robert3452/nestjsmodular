import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive } from 'class-validator';

export class CreateOrderItemDto {
  @IsNotEmpty()
  @IsPositive()
  productId: number;

  @IsNotEmpty()
  @IsPositive()
  orderId: number;

  @IsNotEmpty()
  @IsPositive()
  quantity: number;
}

export class UpdateOrderItemDto extends PartialType(CreateOrderItemDto) {}
