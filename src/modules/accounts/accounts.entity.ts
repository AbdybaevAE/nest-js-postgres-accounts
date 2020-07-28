import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    OneToOne,
    JoinColumn,
  } from 'typeorm';
  import { User } from '../users/user.entity';
  @Entity()
  export class Account {
    @PrimaryGeneratedColumn()
    id: number;
  
    @OneToOne(() => User)
    @JoinColumn()
    user: User;
  
    @Column()
    balance: number;
  }
  