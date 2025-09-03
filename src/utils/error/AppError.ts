export enum ErrorCodes {
    INTERNAL_SERVER_ERROR = 500,
    NOT_FOUND = 404,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
}
class AppError extends Error {
    constructor(public message: string, public statusCode: typeof ErrorCodes[keyof typeof ErrorCodes]) {
        super(message);
        this.statusCode = statusCode;
    }
}
export default AppError;