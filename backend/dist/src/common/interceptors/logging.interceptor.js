"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
let LoggingInterceptor = class LoggingInterceptor {
    constructor() {
        this.logger = new common_1.Logger('HTTP');
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const { method, url, body, headers } = request;
        const userAgent = headers['user-agent'] || '';
        const tenantId = headers['x-tenant-id'] || 'no-tenant';
        const now = Date.now();
        this.logger.log(`[${tenantId}] ${method} ${url} - ${userAgent}`);
        if (process.env.NODE_ENV === 'development' && body && Object.keys(body).length > 0) {
            const sanitizedBody = { ...body };
            if (sanitizedBody.password)
                sanitizedBody.password = '***';
            if (sanitizedBody.token)
                sanitizedBody.token = '***';
            this.logger.debug(`Request Body: ${JSON.stringify(sanitizedBody)}`);
        }
        return next.handle().pipe((0, operators_1.tap)({
            next: () => {
                const response = context.switchToHttp().getResponse();
                const duration = Date.now() - now;
                this.logger.log(`[${tenantId}] ${method} ${url} - ${response.statusCode} - ${duration}ms`);
            },
            error: (error) => {
                const duration = Date.now() - now;
                this.logger.error(`[${tenantId}] ${method} ${url} - ${error.status || 500} - ${duration}ms - ${error.message}`);
            },
        }));
    }
};
exports.LoggingInterceptor = LoggingInterceptor;
exports.LoggingInterceptor = LoggingInterceptor = __decorate([
    (0, common_1.Injectable)()
], LoggingInterceptor);
//# sourceMappingURL=logging.interceptor.js.map