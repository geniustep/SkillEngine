import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
export declare enum ErrorCode {
    VALIDATION_ERROR = "VALIDATION_ERROR",
    UNAUTHORIZED = "UNAUTHORIZED",
    FORBIDDEN = "FORBIDDEN",
    NOT_FOUND = "NOT_FOUND",
    CONFLICT = "CONFLICT",
    INTERNAL_ERROR = "INTERNAL_ERROR",
    RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",
    TENANT_NOT_FOUND = "TENANT_NOT_FOUND",
    INSUFFICIENT_PERMISSIONS = "INSUFFICIENT_PERMISSIONS",
    BAD_REQUEST = "BAD_REQUEST",
    DATABASE_ERROR = "DATABASE_ERROR"
}
export declare class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger;
    catch(exception: unknown, host: ArgumentsHost): void;
}
