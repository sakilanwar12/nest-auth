import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse, TypedResponse } from '../common-api.types';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T>> {
    const res = context.switchToHttp().getResponse<TypedResponse>();

    const statusCode = res.statusCode ?? 200;

    return next.handle().pipe(
      map((data: T) => ({
        success: true,
        statusCode,
        data,
      })),
    );
  }
}
