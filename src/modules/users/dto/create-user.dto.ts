import { IsNotEmpty, IsEmail } from 'class-validator';

export class CreateUserDto {

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
}