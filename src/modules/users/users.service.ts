import * as bcrypt from 'bcrypt';

import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { In, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { AccountsService } from '../accounts/accounts.service';
import { Account } from '../accounts/entities/account.entity';
import { USER_ERRORS } from 'src/shared/helpers/responses/errors/user-errors.helpers';

@Injectable()
export class UsersService {
  private readonly salt: string;
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly accountService: AccountsService,

    private readonly configService: ConfigService<
      {
        SECURITY_SALT: string;
      },
      true
    >,
  ) {
    this.salt = configService.get<string>('SECURITY_SALT', {
      infer: true,
    });
  }

  async create(createUserDto: CreateUserDto) {
    const userAlreadyExist = await this.findOneByUsername(
      createUserDto.username,
    );
    console.log(createUserDto);

    if (userAlreadyExist) {
      throw new BadRequestException(USER_ERRORS.userAlreadyExist);
    }
    const user: CreateUserDto = this.userRepository.create(createUserDto);

    const salt = await bcrypt.genSalt(10);

    const hash = await bcrypt.hash(createUserDto.password, salt);

    user.password = hash;

    const userCreated: User = await this.userRepository.save(user);

    if (!userCreated) {
      throw new BadRequestException(USER_ERRORS.errorWhenRegistering);
    }

    const account = await this.accountService.create({ balance: 100 });

    return this.userRepository.save({ ...userCreated, account: account });
  }

  async findOneByUsername(username: string) {
    return this.userRepository.findOne({
      where: { username },
      relations: ['account'],
    });
  }

  async findTransactionUsersByIds(accountsId: string[]) {
    return this.userRepository.find({
      where: {
        account: In(accountsId),
      },
    });
  }
}
