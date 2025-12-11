"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var TenantGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantGuard = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let TenantGuard = TenantGuard_1 = class TenantGuard {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(TenantGuard_1.name);
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const tenantId = request.headers['x-tenant-id'];
        if (!tenantId) {
            const user = request.user;
            if (user?.tenantId) {
                request.headers['x-tenant-id'] = user.tenantId;
                return true;
            }
            throw new common_1.BadRequestException('X-Tenant-ID header is required');
        }
        try {
            const tenant = await this.prisma.tenant.findUnique({
                where: { id: tenantId },
                select: { id: true, status: true },
            });
            if (!tenant) {
                throw new common_1.BadRequestException('المؤسسة غير موجودة');
            }
            if (tenant.status !== 'active') {
                throw new common_1.BadRequestException('المؤسسة غير نشطة');
            }
            return true;
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            this.logger.error(`Tenant validation error: ${error}`);
            throw new common_1.BadRequestException('فشل التحقق من المؤسسة');
        }
    }
};
exports.TenantGuard = TenantGuard;
exports.TenantGuard = TenantGuard = TenantGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TenantGuard);
//# sourceMappingURL=tenant.guard.js.map