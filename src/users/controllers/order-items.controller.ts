import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CreateOrderItemDto, UpdateOrderItemDto } from '../dtos/order-item.dto';
import { OrderItemsService } from '../services/order-items.service';

@Controller('order-items')
export class OrderItemsController {
  constructor(private orderItemsService: OrderItemsService) {}

  @Post()
  create(@Body() payload: CreateOrderItemDto) {
    return this.orderItemsService.create(payload);
  }

  @Get()
  getAll() {
    return this.orderItemsService.findAll();
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.orderItemsService.findOne(id);
  }

  @Put(':id')
  updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateOrderItemDto,
  ) {
    return this.orderItemsService.update(id, payload);
  }

  @Delete(':id')
  deleteOne(@Param('id', ParseIntPipe) id: number) {
    return this.orderItemsService.delete(id);
  }
}
