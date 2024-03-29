import { PrimaryGeneratedColumn, Entity, Column, ManyToOne } from 'typeorm';
import { Exclude } from 'class-transformer';

import { Product } from '../../products/entities/product.entity';
import { Order } from './order.entity';
import { DateAt } from '../../database/dateAt.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(() => DateAt)
  @Exclude()
  register: DateAt;

  @Column({ type: 'int' })
  quantity: number;

  @ManyToOne(() => Product)
  product: Product;

  @ManyToOne(() => Order, (order) => order.items)
  order: Order;
}
