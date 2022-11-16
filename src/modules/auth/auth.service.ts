import * as bcrypt from 'bcrypt';

import {
  BadRequestException,
  Injectable,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { AUTH_ERRORS } from 'src/shared/helpers/responses/errors/auth-errors.helpers';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private jwtService: JwtService,
  ) { }

  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async signIn(user: User) {
    const verifyIfUserIsValid = await this.validateUser(
      user.username,
      user.password,
    );

    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findOneByUsername(username);

    if (!user) {
      throw new BadRequestException(AUTH_ERRORS.userDoesntExist);
    }

    const verifiedPassword = await bcrypt.compare(password, user.password);

    if (!user || !verifiedPassword) {
      throw new BadRequestException(AUTH_ERRORS.userDoesntExist);
    }
    const { password: passwordd, ...result } = user;
    return result;
  }
}
