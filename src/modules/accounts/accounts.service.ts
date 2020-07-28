import {
  Injectable,
  HttpException,
  HttpStatus,
  SerializeOptions,
} from '@nestjs/common';
import { createTransferDto } from './dto/create-transfer.dto';
import { createPaymentDto } from './dto/create-payment.dto';
import { Connection } from 'typeorm';
import { User } from '../users/user.entity';
import { Transaction } from '../transactions/transactions.entity';
import { Payment } from '../payments/payments.entity';
import { Account } from './accounts.entity';
import { TransactionType, IsolationLevel } from '../../core/utils';
import { GetSuccess, TPromiseResponse } from '../../core/response';
import { CreatePaymentRO, CreateTransferRO } from './accounts.intefaces';
// import {User} from '../users/user.entity';
@Injectable()
export class AccountsService {
  constructor(private connection: Connection) {}

  async createTransfer(
    dto: createTransferDto,
  ): TPromiseResponse<CreateTransferRO> {
    const { userFrom, userTo, amount } = dto;
    const queryRunner = this.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction(IsolationLevel.SERIALIZABLE);
      const userFromEntity = await queryRunner.manager
        .getRepository(User)
        .findOne(userFrom);

      const userToEntity = await queryRunner.manager
        .getRepository(User)
        .findOne(userTo);
      if (!userFromEntity || !userToEntity)
        throw new HttpException(
          {
            message: `Invalid user emails.`,
          },
          HttpStatus.BAD_REQUEST,
        );
      const accountFromEntity = await queryRunner.manager
        .getRepository(Account)
        .findOne({ user: userFromEntity });

      const accountToEntity = await queryRunner.manager
        .getRepository(Account)
        .findOne({ user: userToEntity });
      if (!accountFromEntity || !accountToEntity) {
        console.error(dto);
        throw new HttpException(
          {
            message: 'Server internal error.',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      if (accountFromEntity.balance < amount)
        throw new HttpException(
          {
            message: 'Not enough money to make transfer.',
          },
          HttpStatus.FORBIDDEN,
        );
      const newTransaction = new Transaction();
      newTransaction.accountFrom = userFromEntity;
      newTransaction.accountTo = userToEntity;
      newTransaction.amount = amount;
      newTransaction.type = TransactionType.TRANSFER;
      accountFromEntity.balance -= amount;
      accountToEntity.balance += amount;

      await queryRunner.manager.save(newTransaction);
      await queryRunner.manager.save(accountFromEntity);
      await queryRunner.manager.save(accountToEntity);

      await queryRunner.commitTransaction();
      await queryRunner.release();
      return this.buildTransferRO(newTransaction);
    } catch (e) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw e;
    }
  }

  async createPayment(
    dto: createPaymentDto,
  ): TPromiseResponse<CreatePaymentRO> {
    const { paymentId, email, amount } = dto;
    const queryRunner = this.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction(IsolationLevel.SERIALIZABLE);
      const user = await queryRunner.manager
        .getRepository(User)
        .findOne({ email });
      if (!user)
        throw new HttpException(
          { message: 'No such user with given email.' },
          HttpStatus.NOT_FOUND,
        );
      const payment = await queryRunner.manager
        .getRepository(Payment)
        .findOne({ paymentId });
      if (payment)
        throw new HttpException(
          { message: `Payment ${paymentId} is already exists.` },
          HttpStatus.BAD_REQUEST,
        );
      const account = await queryRunner.manager.getRepository(Account).findOne({
        user,
      });
      if (!account) {
        console.error(dto);
        throw new HttpException(
          { message: 'Server internal error.' },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      account.balance += amount;

      const newPayment = new Payment();
      newPayment.paymentId = paymentId;
      newPayment.user = user;
      newPayment.amount = amount;

      const newTransaction = new Transaction();
      // newTransaction.accountFrom = user;
      newTransaction.accountTo = user;
      newTransaction.amount = amount;
      newTransaction.type = TransactionType.REFILL;
      await queryRunner.manager.save(newPayment);
      await queryRunner.manager.save(newTransaction);
      await queryRunner.manager.save(account);

      await queryRunner.commitTransaction();
      await queryRunner.release();
      return this.buildPaymentRO(newPayment);
    } catch (e) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw e;
    }
  }
  private buildPaymentRO(payment: Payment) {
    const { paymentId, amount } = payment;
    return GetSuccess({ paymentId, amount });
  }
  private buildTransferRO(transaction: Transaction) {
    const { accountTo, amount } = transaction;
    return GetSuccess({ amount, userId: accountTo.id });
  }
}
