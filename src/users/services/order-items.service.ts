import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/database/entities/product.entity';
import { Repository } from 'typeorm';
import { CreateOrderItemDto, UpdateOrderItemDto } from '../dtos/order-item.dto';
import { OrderItem } from 'src/database/entities/order-item.entity';
import { Order } from 'src/database/entities/order.entity';

@Injectable()
export class OrderItemsService {
  constructor(
    @InjectRepository(OrderItem) private itemRepo: Repository<OrderItem>,
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
  ) {}

  findAll() {
    return this.itemRepo.find();
  }

  async findOne(id: number) {
    const orderItem = await this.itemRepo.findOne(id, {
      relations: ['product', 'order'],
    });
    if (!orderItem) {
      throw new NotFoundException(`OrderItem not found id: ${id}`);
    }
    return orderItem;
  }

  async create(data: CreateOrderItemDto) {
    const newOrderItem = this.itemRepo.create({ quantity: data.quantity });

    const productFound = await this.productRepo.findOne(data.productId);
    const orderFound = await this.orderRepo.findOne(data.orderId);
    if (!productFound) {
      throw new NotFoundException(
        `Product with id not foud: ${data.productId}`,
      );
    }

    newOrderItem.product = productFound;
    if (!orderFound) {
      throw new NotFoundException(`Order with id not foud: ${data.orderId}`);
    }
    newOrderItem.order = orderFound;

    return this.itemRepo.save(newOrderItem);
  }

  async update(id: number, data: UpdateOrderItemDto) {
    const orderItem = await this.itemRepo.findOne(id);
    this.itemRepo.merge(orderItem, data);

    return this.itemRepo.save(orderItem);
  }

  async delete(id: number) {
    return this.itemRepo.delete(id);
  }
}
