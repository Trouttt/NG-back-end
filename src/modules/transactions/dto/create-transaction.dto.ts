import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsString()
  debitedAccountName: string;

  @IsNotEmpty()
  @IsString()
  creditedAccountName: string;

  @IsNumber()
  @IsNotEmpty()
  value: number;
}
