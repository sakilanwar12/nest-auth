export interface ApiResponseOptions<T> {
  data?: T;
  success?: boolean;
  statusCode?: number;
  message?: string;
  errors?: any[];
  pagination?: Record<string, any>;
}

export function apiResponse<T>({
  data,
  success = true,
  statusCode = 200,
  message = '',
  errors,
  pagination,
}: ApiResponseOptions<T>) {
  const response: Record<string, any> = {
    success,
    statusCode,
  };

  if (success) {
    response.data = data;
    if (pagination) {
      response.pagination = pagination;
    }
    if (message) {
      response.message = message;
    }
  } else {
    response.message = message || 'Something went wrong';
    if (errors) {
      response.errors = errors;
    }
  }

  return response;
}
