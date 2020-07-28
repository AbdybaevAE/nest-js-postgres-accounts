import { IsNotEmpty, IsString, IsNumber, IsEmail, Min } from 'class-validator';

export class createPaymentDto {

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly paymentId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  readonly amount: number;
}