import {
  IsNotEmpty,
  IsString,
  IsUUID,
  Matches,
  MinLength,
} from 'class-validator';
export class CreateUserDto {
  @MinLength(3)
  @IsString()
  username: string;

  @MinLength(8)
  @IsString()
  @Matches(/(?=.*\d)(?=.*[A - Z])/, {
    message: 'password needs a number and a uppercase letter',
  })
  password: string;
}
