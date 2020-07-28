import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    OneToOne,
    JoinColumn,
    OneToMany,
    ManyToMany,
  } from 'typeorm';
  import { User } from '../users/user.entity';
  import { TransactionType } from '../../core/utils';
  @Entity()
  export class Transaction {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToMany(type => User)
    accountFrom: User;
  
    @ManyToMany(type => User)
    accountTo: User;
  
    @Column({
      type: 'enum',
      enum: TransactionType,
      default: TransactionType.REFILL,
    })
    type: TransactionType;
  
    @Column()
    amount: number;
  }
  