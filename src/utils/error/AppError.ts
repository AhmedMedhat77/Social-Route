export enum ErrorCodes {
  INTERNAL_SERVER_ERROR = 500,
  NOT_FOUND = 404,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  CONFLICT = 409,
  NOT_ACCEPTABLE = 406,
}
class AppError extends Error {
  constructor(
    message: string,
    public statusCode: (typeof ErrorCodes)[keyof typeof ErrorCodes],
    public errorDetails?: Record<string, string>[]
  ) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class ConflictException extends AppError {
  constructor(message: string, errorDetails?: Record<string, string>[]) {
    super(message, ErrorCodes.CONFLICT, errorDetails);
  }
}

export class BadRequestException extends AppError {
  constructor(message: string, errorDetails?: Record<string, string>[]) {
    super(message, ErrorCodes.BAD_REQUEST, errorDetails);
  }
}

export class UnauthorizedException extends AppError {
  constructor(message: string, errorDetails?: Record<string, string>[]) {
    super(message, ErrorCodes.UNAUTHORIZED, errorDetails);
  }
}

export class ForbiddenException extends AppError {
  constructor(message: string, errorDetails?: Record<string, string>[]) {
    super(message, ErrorCodes.FORBIDDEN, errorDetails);
  }
}

export class NotAcceptableException extends AppError {
  constructor(message: string, errorDetails?: Record<string, string>[]) {
    super(message, ErrorCodes.NOT_ACCEPTABLE, errorDetails);
  }
}

export class NotFoundException extends AppError {
  constructor(message: string, errorDetails?: Record<string, string>[]) {
    super(message, ErrorCodes.NOT_FOUND, errorDetails);
  }
}

export default AppError;
