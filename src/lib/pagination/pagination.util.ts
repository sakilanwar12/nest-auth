import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import convertToNumber from '../numbers/convertToNumber';

export function extractQueryObject<T extends object>(
  query: PaginationQueryDto & T,
) {
  const { page = 1, pageSize = 10, search, sort, ...filters } = query;

  return {
    page: convertToNumber({ value: page, fallback: 1 }),
    pageSize: convertToNumber({ value: pageSize, fallback: 10 }),
    search,
    sort,
    filters,
  };
}
