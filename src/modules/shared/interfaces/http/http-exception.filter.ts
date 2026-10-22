import { type ArgumentsHost, Catch, type ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import type { Request, Response } from 'express';
import { DomainError } from '../../domain/errors/errors.js';
import type { ErrorDto } from './dto/error-dto.js';

type ErrorBody = Pick<ErrorDto, 'statusCode' | 'error' | 'message'>;

/**
 * One error format for every HTTP failure: domain errors, Nest exceptions (validation, 401 from the guard...),
 * duplicate keys in Mongo (409) and anything unexpected (500, without its details).
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    // Bodies that are not errors of ours, like the health report of a failed /v1/health, go out untouched.
    if (
      exception instanceof HttpException &&
      typeof exception.getResponse() === 'object' &&
      !('message' in (exception.getResponse() as object))
    ) {
      this.logger.warn(`${request.method} ${request.originalUrl}: ${exception.getStatus()}`);
      ctx.getResponse<Response>().status(exception.getStatus()).json(exception.getResponse());
      return;
    }
    const body = toErrorBody(exception);
    const where = `${request.method} ${request.originalUrl}`;
    if (body.statusCode >= 500) {
      this.logger.error(`${where}: ${body.statusCode}`, exception instanceof Error ? exception.stack : String(exception));
    } else {
      this.logger.warn(`${where}: ${body.statusCode} ${body.error} ${JSON.stringify(body.message)}`);
    }
    ctx
      .getResponse<Response>()
      .status(body.statusCode)
      .json({ ...body, timestamp: new Date().toISOString(), path: request.originalUrl } satisfies ErrorDto);
  }
}

function toErrorBody(exception: unknown): ErrorBody {
  if (exception instanceof DomainError) {
    return { statusCode: exception.statusCode, error: exception.name, message: exception.message };
  }
  if (exception instanceof HttpException) {
    const response = exception.getResponse();
    const fields = typeof response === 'object' ? (response as { message?: unknown }) : {};
    const message = Array.isArray(fields.message) || typeof fields.message === 'string' ? fields.message : exception.message;
    // The class name, like domain errors: BadRequestException, UnauthorizedException...
    return { statusCode: exception.getStatus(), error: exception.name, message: message as string | string[] };
  }
  if (isDuplicateKey(exception)) {
    return { statusCode: HttpStatus.CONFLICT, error: 'ConflictError', message: `Duplicate key ${JSON.stringify(exception.keyValue)}` };
  }
  return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, error: 'InternalServerError', message: 'Internal server error' };
}

function isDuplicateKey(exception: unknown): exception is { keyValue?: unknown } {
  return exception instanceof Error && exception.name === 'MongoServerError' && (exception as unknown as { code?: number }).code === 11000;
}
