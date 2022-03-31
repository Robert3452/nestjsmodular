import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/database/entities/user.entity';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import { Order } from 'src/database/entities/order.entity';
import { ProductsService } from 'src/products/services/products.service';
import { Client } from 'pg';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomersService } from './customers.service';

@Injectable()
export class UsersService {
  constructor(
    private productService: ProductsService,
    @InjectRepository(User) private userRepo: Repository<User>,
    private customersService: CustomersService,
    @Inject('PG') private clientPg: Client,
  ) {}

  findAll() {
    return this.userRepo.find({
      relations: ['customer'],
    });
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne(id, { relations: ['customer'] });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User with email: ${email} not Found`);
    }
    return user;
  }

  async create(data: CreateUserDto) {
    const newUser = this.userRepo.create(data);
    if (data.customerId) {
      const customer = await this.customersService.findOne(data.customerId);
      newUser.customer = customer;
    }
    return this.userRepo.save(newUser);
  }

  async update(id: number, changes: UpdateUserDto) {
    const user = await this.findOne(id);
    if (changes.customerId) {
      const customer = await this.customersService.findOne(changes.customerId);
      user.customer = customer;
    }
    this.userRepo.merge(user, changes);
    return this.userRepo.save(user);
  }

  async remove(id: number) {
    const userFound = await this.findOne(id);
    await this.userRepo.remove(userFound);
    return userFound;
  }

  async getOrdersByUser(id: number): Promise<Order[]> {
    const user = await this.findOne(id);
    if (!user.customer) {
      throw new NotFoundException(`Customer not found userId ${id}`);
    }
    return user.customer.orders || [];
  }

  getTasks() {
    return new Promise((resolve, reject) => {
      this.clientPg.query('SELECT * FROM tasks', (err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(res.rows);
      });
    });
  }
}
