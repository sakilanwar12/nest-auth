import { Response as ExpressResponse } from 'express';
export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  data: T;
}
export interface TypedResponse extends ExpressResponse {
  statusCode: number;
}
export interface IQueryObject<T> {
  page: number;
  pageSize: number;
  search?: string;
  sort?: string;
  filters?: T;
}
