import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository, Connection } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { validate } from 'class-validator';
import { UserRO } from './user.intefaces';
import { GetSuccess, TPromiseResponse } from 'src/core/response';
import { Account } from '../accounts/accounts.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private connection: Connection,
  ) {}

  async findAll(): TPromiseResponse<User[]> {
    const users = await this.usersRepository.find();
    return GetSuccess(users);
  }

  async create(dto: CreateUserDto): TPromiseResponse<CreateUserDto> {
    const { email } = dto;
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const user = await queryRunner.manager
      .getRepository(User)
      .findOne({ email });
    try {
      if (user)
        throw new HttpException(
          { message: 'Email must be unique.' },
          HttpStatus.BAD_REQUEST,
        );
      const newUser = new User();
      newUser.email = email;
      const errors = await validate(newUser);
      if (errors.length > 0)
        throw new HttpException(
          { message: 'Input data validation failed.' },
          HttpStatus.BAD_REQUEST,
        );
      const savedUser = await queryRunner.manager.save(newUser);
      const newAccount = new Account();
      newAccount.balance = 0;
      newAccount.user = savedUser;
      await queryRunner.manager.save(newAccount);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return this.buildUserRO(savedUser);
    } catch (e) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw e;
    }
  }

  private buildUserRO(user: User) {
    const { id, email } = user;
    return GetSuccess({ id, email });
  }
}
