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
  ///(?=.*\d)(?=.*[A - Z])/
  @MinLength(8)
  @IsString()
  @Matches(/[A-Z]/, {
    message: 'password needs a uppercase letter',
  })
  @Matches(/[0-9]/, {
    message: 'password needs a number',
  })
  password: string;
}
