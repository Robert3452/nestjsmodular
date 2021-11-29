import { PrimaryGeneratedColumn, Column, Entity, ManyToMany } from 'typeorm';
import { Timestamp } from '../../Global/Entity/Timestamp.entity';
import { Product } from './product.entity';
@Entity({ name: 'categories' })
export class Category extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', unique: true })
  name: string;
  @ManyToMany(() => Product, (product) => product.categories)
  products: Product[];
}
