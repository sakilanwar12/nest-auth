import { Injectable } from '@nestjs/common';
import {
  IPaginationQuery,
  IPaginatedResult,
  IPaginationMeta,
} from './pagination.types';

@Injectable()
export class PaginationService {
  async paginate<T>(
    query: IPaginationQuery,
    fetcher: (skip: number, take: number) => Promise<T[]>,
    counter: () => Promise<number>,
  ): Promise<IPaginatedResult<T>> {
    const page = query?.page ?? 1;
    const pageSize = Math.max(1, query.pageSize ?? 10);
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const [data, total] = await Promise.all([fetcher(skip, take), counter()]);

    const pagination: IPaginationMeta = {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };

    return { data, pagination };
  }
}
