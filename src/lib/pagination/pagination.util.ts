import convertToNumber from '../numbers/convertToNumber';
import { PaginationQueryDto } from './pagination-query.dto';

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
