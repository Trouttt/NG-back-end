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

  @OneToOne(() => Account, { eager: true })
  @JoinColumn()
  account: Account;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;
}
