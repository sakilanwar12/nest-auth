import { Response as ExpressResponse } from 'express';
export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  data: T;
}
export interface TypedResponse extends ExpressResponse {
  statusCode: number;
}
