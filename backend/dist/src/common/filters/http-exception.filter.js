"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var HttpExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionFilter = exports.ErrorCode = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
var ErrorCode;
(function (ErrorCode) {
    ErrorCode["VALIDATION_ERROR"] = "VALIDATION_ERROR";
    ErrorCode["UNAUTHORIZED"] = "UNAUTHORIZED";
    ErrorCode["FORBIDDEN"] = "FORBIDDEN";
    ErrorCode["NOT_FOUND"] = "NOT_FOUND";
    ErrorCode["CONFLICT"] = "CONFLICT";
    ErrorCode["INTERNAL_ERROR"] = "INTERNAL_ERROR";
    ErrorCode["RATE_LIMIT_EXCEEDED"] = "RATE_LIMIT_EXCEEDED";
    ErrorCode["TENANT_NOT_FOUND"] = "TENANT_NOT_FOUND";
    ErrorCode["INSUFFICIENT_PERMISSIONS"] = "INSUFFICIENT_PERMISSIONS";
    ErrorCode["BAD_REQUEST"] = "BAD_REQUEST";
    ErrorCode["DATABASE_ERROR"] = "DATABASE_ERROR";
})(ErrorCode || (exports.ErrorCode = ErrorCode = {}));
let HttpExceptionFilter = HttpExceptionFilter_1 = class HttpExceptionFilter {
    constructor() {
        this.logger = new common_1.Logger(HttpExceptionFilter_1.name);
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let errorCode = ErrorCode.INTERNAL_ERROR;
        let message = 'حدث خطأ داخلي في الخادم';
        let details;
        if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
                const resp = exceptionResponse;
                message = resp.message || exception.message;
                if (Array.isArray(resp.message)) {
                    details = resp.message.map((msg) => ({ message: msg }));
                    message = 'فشل التحقق من البيانات';
                }
            }
            else {
                message = exceptionResponse;
            }
            switch (status) {
                case common_1.HttpStatus.BAD_REQUEST:
                    errorCode = ErrorCode.VALIDATION_ERROR;
                    break;
                case common_1.HttpStatus.UNAUTHORIZED:
                    errorCode = ErrorCode.UNAUTHORIZED;
                    message = message || 'غير مصرح لك بالوصول';
                    break;
                case common_1.HttpStatus.FORBIDDEN:
                    errorCode = ErrorCode.FORBIDDEN;
                    message = message || 'ليس لديك صلاحية للقيام بهذا الإجراء';
                    break;
                case common_1.HttpStatus.NOT_FOUND:
                    errorCode = ErrorCode.NOT_FOUND;
                    message = message || 'المورد المطلوب غير موجود';
                    break;
                case common_1.HttpStatus.CONFLICT:
                    errorCode = ErrorCode.CONFLICT;
                    break;
                case common_1.HttpStatus.TOO_MANY_REQUESTS:
                    errorCode = ErrorCode.RATE_LIMIT_EXCEEDED;
                    message = 'تجاوزت الحد المسموح من الطلبات';
                    break;
                default:
                    errorCode = ErrorCode.INTERNAL_ERROR;
            }
        }
        if (exception instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            status = common_1.HttpStatus.BAD_REQUEST;
            errorCode = ErrorCode.DATABASE_ERROR;
            switch (exception.code) {
                case 'P2002':
                    message = 'هذا السجل موجود بالفعل';
                    status = common_1.HttpStatus.CONFLICT;
                    errorCode = ErrorCode.CONFLICT;
                    break;
                case 'P2025':
                    message = 'السجل المطلوب غير موجود';
                    status = common_1.HttpStatus.NOT_FOUND;
                    errorCode = ErrorCode.NOT_FOUND;
                    break;
                case 'P2003':
                    message = 'فشل في العلاقة مع سجل آخر';
                    break;
                default:
                    message = 'خطأ في قاعدة البيانات';
            }
        }
        if (exception instanceof client_1.Prisma.PrismaClientValidationError) {
            status = common_1.HttpStatus.BAD_REQUEST;
            errorCode = ErrorCode.VALIDATION_ERROR;
            message = 'بيانات غير صالحة';
        }
        this.logger.error(`${request.method} ${request.url} - ${status} - ${message}`, exception instanceof Error ? exception.stack : undefined);
        const errorResponse = {
            success: false,
            error: {
                code: errorCode,
                message,
                ...(details && { details }),
            },
            timestamp: new Date().toISOString(),
            path: request.url,
        };
        response.status(status).json(errorResponse);
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = HttpExceptionFilter_1 = __decorate([
    (0, common_1.Catch)()
], HttpExceptionFilter);
//# sourceMappingURL=http-exception.filter.js.map