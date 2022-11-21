import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PageOptionsDto } from 'src/shared/dtos/page-options.dto';
import { PageDto } from 'src/shared/dtos/page.dto';
import { Transaction } from './entities/transaction.entity';
import { FindTransactionDto } from './dto/find-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.makeTransaction(createTransactionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAllTransactions(
    @Request() body,
    @Query() pageOptionsDto: PageOptionsDto,
  ) {
    return this.transactionsService.findAllTransactions(pageOptionsDto, body);
  }
}
