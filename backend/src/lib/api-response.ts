import { Response } from 'express';
import { AppError } from './api-error';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

export function sendSuccess<T>(res: Response, data: T, meta?: ApiResponse['meta'], status = 200) {
  const body: ApiResponse<T> = { success: true, data };
  if (meta) body.meta = meta;
  res.status(status).json(body);
}

export function sendError(res: Response, error: AppError) {
  const body: ApiResponse = {
    success: false,
    error: { code: error.code, message: error.message },
  };
  res.status(error.statusCode).json(body);
}

export function sendPaginated<T>(
  res: Response,
  data: T[],
  total: number,
  page: number,
  limit: number,
) {
  sendSuccess(res, data, { total, page, limit });
}
