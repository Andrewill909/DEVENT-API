import { HttpStatusCode } from './Controllers/statusCode';
import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

export interface Details {
  msg?: string;
  param?: string;
  location?: string;
}

export class BaseError extends Error {
  public readonly name: string;
  public readonly statusCode: HttpStatusCode;
  public readonly isOperational: boolean;

  constructor(name: string, description: string, statusCode: HttpStatusCode, isOperational: boolean) {
    super(description);
    //? restore prototype chain
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this);
  }
}

export class ValidationError extends BaseError {
  public readonly details: Details[];
  constructor(details?: Details[], name?: string, description?: string) {
    name = name || 'Client Error';
    description = description || 'BAD_REQUEST';
    super(name, description, HttpStatusCode.BAD_REQUEST, true);
    this.details = details || [{ msg: 'no additional information' }];
  }
}

export class UnprocessableError extends BaseError {
  public readonly detail: string;
  constructor(detail?: string, name?: string, description?: string) {
    name = name || 'Client Error';
    description = description || 'UNPROCESSABLE_ENTITY';
    super(name, description, HttpStatusCode.UNPROCESSABLE_ENTITY, true);
    this.detail = detail || 'no additional information';
  }
}

export class JWTError extends BaseError {
  public readonly detail: string;
  constructor(detail?: string, name?: string, description?: string) {
    name = name || 'Token Error';
    description = description || 'UNAUTHORIZED';
    super(name, description, HttpStatusCode.UNAUTHORIZED, true);
    this.detail = detail || 'no additional information';
  }
}

//? Default error handler
export function errorMiddleware(error: Error, req: Request, res: Response, next: NextFunction): void {
  console.log(JSON.stringify(error));
  if (error instanceof ValidationError) {
    res.status(error.statusCode).json({
      error: error.name,
      message: error.message,
      details: error.details,
    });
  } else if (error instanceof UnprocessableError || error instanceof JWTError) {
    res.status(error.statusCode).json({
      error: error.name,
      message: error.message,
      details: error.detail,
    });
  } else {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      error: 1,
      message: error.message,
    });
  }
  return;
}
