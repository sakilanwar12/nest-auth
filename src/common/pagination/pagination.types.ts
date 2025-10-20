export interface IPaginationQuery {
  page?: number;
  pageSize?: number;
}

export interface IPaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface IPaginatedResult<T> {
  data: T[];
  pagination: IPaginationMeta;
}
