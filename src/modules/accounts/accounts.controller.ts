import { Controller, UsePipes, ValidationPipe, Post, Body } from '@nestjs/common';
import { createPaymentDto } from './dto/create-payment.dto';
import { createTransferDto } from './dto/create-transfer.dto';
import { AccountsService } from './accounts.service';

@Controller('accounts')
export class AccountsController {
    constructor(private readonly accountsService: AccountsService) {}
    
    @UsePipes(new ValidationPipe())
    @Post('payment')
    async createPayment(@Body() paymentData: createPaymentDto) {
      return this.accountsService.createPayment(paymentData);
    }

    @UsePipes(new ValidationPipe())
    @Post('transfer')
    async createTransfer(@Body() transferData: createTransferDto) {
      return this.accountsService.createTransfer(transferData);
    }
}
