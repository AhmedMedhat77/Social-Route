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
    public statusCode: (typeof ErrorCodes)[keyof typeof ErrorCodes]
  ) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class ConflictException extends AppError {
  constructor(message: string) {
    super(message, ErrorCodes.CONFLICT);
  }
}

export class BadRequestException extends AppError {
  constructor(message: string) {
    super(message, ErrorCodes.BAD_REQUEST);
  }
}

export class UnauthorizedException extends AppError {
  constructor(message: string) {
    super(message, ErrorCodes.UNAUTHORIZED);
  }
}

export class ForbiddenException extends AppError {
  constructor(message: string) {
    super(message, ErrorCodes.FORBIDDEN);
  }
}

export class NotAcceptableException extends AppError {
  constructor(message: string) {
    super(message, ErrorCodes.NOT_ACCEPTABLE);
  }
}

export class NotFoundException extends AppError {
  constructor(message: string) {
    super(message, ErrorCodes.NOT_FOUND);
  }
}

export default AppError;
