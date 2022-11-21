import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { dataSource } from 'ormconfig-migrations';
import { PageMetaDataDto } from 'src/shared/dtos/page-meta-data.dto';
import { PageOptionsDto } from 'src/shared/dtos/page-options.dto';
import { PageDto } from 'src/shared/dtos/page.dto';
import { TRANSACTIONS_ERRORS } from 'src/shared/helpers/responses/errors/transactions-errors.helpers';
import { USER_ERRORS } from 'src/shared/helpers/responses/errors/user-errors.helpers';
import { Equal, FindOptionsWhere, Repository } from 'typeorm';
import { AccountsService } from '../accounts/accounts.service';
import { Account } from '../accounts/entities/account.entity';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { FindTransactionDto } from './dto/find-transaction.dto';
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

  async findAllTransactions(pageOptionsDto: PageOptionsDto, body: any) {
    const user = await this.userService.findOneByUsername(body.user.username);
    const { [0]: data, [1]: itemCount }: [data: Transaction[], total: number] =
      await this.transactionRepository.findAndCount({
        order: { createAt: pageOptionsDto.order },
        take: pageOptionsDto.take,
        skip: pageOptionsDto.skip,
        where: [
          { debitedAccount: Equal(user.account.id) },
          { creditedAccount: Equal(user.account.id) },
        ],
      });

    const accounts = [];

    data.forEach((transaction) => {
      if (accounts.indexOf(transaction.creditedAccount.id) === -1)
        accounts.push(transaction.creditedAccount.id);
      if (accounts.indexOf(transaction.debitedAccount.id) === -1)
        accounts.push(transaction.debitedAccount.id);
    });

    const users = await this.userService.findTransactionUsersByIds(accounts);

    const newData = data.map((transaction) => {
      const usersNames = {
        creditedName: '',
        debitedName: '',
      };

      users.forEach((user) => {
        if (user.account.id === transaction.creditedAccount.id) {
          usersNames.creditedName = user.username;
        } else if (user.account.id === transaction.debitedAccount.id)
          usersNames.debitedName = user.username;
      });

      return {
        id: transaction.id,
        value: transaction.value.toLocaleString('pt-br', {
          style: 'currency',
          currency: 'BRL',
        }),
        createAt: transaction.createAt.toLocaleString('pt-BR'),
        origin: usersNames.debitedName,
        receiver: usersNames.creditedName,
      };
    });
    const pageMetaDataDto = new PageMetaDataDto({
      item_count: itemCount,
      page_options_dto: pageOptionsDto,
    });

    return new PageDto(newData, pageMetaDataDto, user.account.balance);
  }
}
