import { PageOptionsDto } from './page-options.dto';

interface PageMetaDataDtoParameters {
  page_options_dto: PageOptionsDto;
  item_count: number;
}

export class PageMetaDataDto {
  readonly page: number;

  readonly take: number;

  readonly item_count: number;

  readonly page_count: number;

  readonly has_previous_page: boolean;

  readonly has_next_page: boolean;

  constructor({ page_options_dto, item_count }: PageMetaDataDtoParameters) {
    this.page = page_options_dto.page;
    this.take = page_options_dto.take;
    this.item_count = item_count;
    this.page_count = Math.ceil(this.item_count / this.take);
    this.has_previous_page = this.page > 1;
    this.has_next_page = this.page < this.page_count;
  }
}
