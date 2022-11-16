import { Account } from 'src/modules/accounts/entities/account.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Account)
  @JoinColumn()
  account: Account;

  @Column()
  username: string;

  @Column()
  password: string;
}
