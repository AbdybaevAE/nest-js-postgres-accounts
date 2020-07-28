import { IsNotEmpty, IsString, IsNumber, IsPositive, Min } from 'class-validator';

export class createTransferDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly userFrom: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly userTo: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  readonly amount: number;
}
