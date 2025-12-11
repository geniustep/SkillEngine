"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantId = void 0;
const common_1 = require("@nestjs/common");
exports.TenantId = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const tenantId = request.headers['x-tenant-id'];
    if (!tenantId) {
        const user = request.user;
        if (user?.tenantId) {
            return user.tenantId;
        }
        throw new common_1.BadRequestException('X-Tenant-ID header is required');
    }
    return tenantId;
});
//# sourceMappingURL=tenant.decorator.js.map