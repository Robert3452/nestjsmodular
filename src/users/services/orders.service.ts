import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderDto, UpdateOrderDto } from '../dtos/order.dto';
import { Customer } from 'src/database/entities/customer.entity';
import { Order } from 'src/database/entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(Customer) private customerRepo: Repository<Customer>,
  ) {}

  async findAll() {
    return this.orderRepo.find();
  }

  async findOne(id: number) {
    const order = await this.orderRepo.findOne(id, {
      relations: ['items','items.product'],
    });
    if (!order) {
      throw new NotFoundException(`Error: order not found id: ${id}`);
    }
    return order;
  }

  async create(data: OrderDto) {
    const order = new Order();
    if (data.customerId) {
      const customer = await this.customerRepo.findOne(data.customerId);
      order.customer = customer;
    }

    return this.orderRepo.save(order);
  }

  async update(id: number, data: UpdateOrderDto) {
    const order = await this.orderRepo.findOne(id);
    if (data.customerId) {
      const customer = await this.customerRepo.findOne(data.customerId);
      if (order) {
        order.customer = customer;
      }
    }
    return this.orderRepo.save(order);
  }

  remove(id: number) {
    return this.orderRepo.delete(id);
  }
}
