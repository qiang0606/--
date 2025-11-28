import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = '服务器内部错误';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || exception.message || '请求失败';
        error = responseObj.error || error;
      }
    } else if (exception instanceof Error) {
      // 处理 Mongoose 验证错误
      if (exception.name === 'ValidationError') {
        status = HttpStatus.BAD_REQUEST;
        const mongooseError = exception as any;
        if (mongooseError.errors) {
          const firstError = Object.values(mongooseError.errors)[0] as any;
          message = firstError?.message || '数据验证失败';
        } else {
          message = mongooseError.message || '数据验证失败';
        }
        error = 'Validation Error';
      } else if (exception.name === 'MongoServerError') {
        // 处理 MongoDB 唯一索引错误
        const mongoError = exception as any;
        if (mongoError.code === 11000) {
          status = HttpStatus.CONFLICT;
          const field = Object.keys(mongoError.keyPattern || {})[0];
          message = `${field || '该字段'}已存在，请使用其他值`;
          error = 'Duplicate Entry';
        } else {
          message = '数据库操作失败';
          error = 'Database Error';
        }
      } else {
        message = exception.message || '操作失败';
      }
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      error,
    };

    response.status(status).json(errorResponse);
  }
}

