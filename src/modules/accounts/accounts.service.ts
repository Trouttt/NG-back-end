import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from './entities/account.entity';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) { }
  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    const account: Account = this.accountRepository.create(createAccountDto);

    return this.accountRepository.save(account);
  }
  findBalanceById(id: string) {
    return this.accountRepository.findOne({ where: { id } });
  }
}
