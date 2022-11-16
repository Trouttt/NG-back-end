import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TRANSACTIONS_ERRORS } from 'src/shared/helpers/responses/errors/transactions-errors.helpers';
import { USER_ERRORS } from 'src/shared/helpers/responses/errors/user-errors.helpers';
import { Repository } from 'typeorm';
import { AccountsService } from '../accounts/accounts.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,

    private readonly accountService: AccountsService,

    private readonly userService: UsersService,
  ) { }

  async processTransaction(
    userCredited: User,
    userDebited: User,
    value: number,
  ) {
    try {
      const updatedUserCredited = await this.accountService.updateAccount({
        account: userCredited.account,
        value,
        isCreditedAccount: true,
      });
      const updatedUserDebited = await this.accountService.updateAccount({
        account: userDebited.account,
        value,
        isCreditedAccount: false,
      });

      if (updatedUserCredited && updatedUserDebited) {
        return true;
      }
    } catch (e: any) {
      throw new BadRequestException(
        TRANSACTIONS_ERRORS.errorWhenUpdating + e.message,
      );
    }
  }

  async makeTransaction(createTransactionDto: CreateTransactionDto) {
    if (
      createTransactionDto.creditedAccountName ===
      createTransactionDto.debitedAccountName
    ) {
      throw new BadRequestException(TRANSACTIONS_ERRORS.usersNeedBeDifferent);
    }
    const userDebited = await this.userService.findOneByUsername(
      createTransactionDto.debitedAccountName,
    );

    const userCredited = await this.userService.findOneByUsername(
      createTransactionDto.creditedAccountName,
    );

    if (!userDebited) {
      throw new BadRequestException(
        USER_ERRORS.userDoesntExiste + createTransactionDto.debitedAccountName,
      );
    } else if (!userCredited) {
      throw new BadRequestException(
        USER_ERRORS.userDoesntExiste + createTransactionDto.creditedAccountName,
      );
    }

    if (userDebited.account.balance < createTransactionDto.value) {
      throw new BadRequestException(TRANSACTIONS_ERRORS.valueIsMoreThanDebited);
    }

    const isMoneyTransfered = await this.processTransaction(
      userCredited,
      userDebited,
      createTransactionDto.value,
    );

    if (isMoneyTransfered) {
      delete createTransactionDto.creditedAccountName;
      delete createTransactionDto.debitedAccountName;

      const transfer = await this.transactionRepository.create(
        createTransactionDto,
      );

      transfer.creditedAccount = userCredited.account;
      transfer.debitedAccount = userDebited.account;

      return this.transactionRepository.save(transfer);
    }
  }
}
