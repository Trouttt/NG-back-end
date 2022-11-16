import { Account } from 'src/modules/accounts/entities/account.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Account, (account) => account.id, {
    cascade: false,
  })
  @JoinColumn({ name: 'debited_account', referencedColumnName: 'id' })
  debitedAccount?: Account;

  @ManyToOne(() => Account, (account) => account.id, {
    cascade: false,
  })
  @JoinColumn({ name: 'credited_account', referencedColumnName: 'id' })
  creditedAccount?: Account;

  @Column()
  value: number;

  @CreateDateColumn({ name: 'created_at' })
  createAt: Date;
}
