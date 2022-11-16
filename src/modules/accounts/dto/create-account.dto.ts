import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateAccountDto {
  @IsNumber()
  @IsNotEmpty()
  balance: number;
}
