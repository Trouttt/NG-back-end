import { PageMetaDataDto } from './page-meta-data.dto';

export class PageDto<T> {
  readonly data: T[];

  readonly meta_data: PageMetaDataDto;

  readonly balance: number;

  constructor(data: T[], meta_data: PageMetaDataDto, balance: number) {
    this.data = data;
    this.meta_data = meta_data;
    this.balance = balance;
  }
}
