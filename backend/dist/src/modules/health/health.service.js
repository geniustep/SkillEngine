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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthService = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const prisma_service_1 = require("../../database/prisma.service");
let HealthService = class HealthService {
    constructor(prisma, cacheManager) {
        this.prisma = prisma;
        this.cacheManager = cacheManager;
        this.startTime = Date.now();
    }
    async getHealth() {
        const dbHealth = await this.checkDatabase();
        const redisHealth = await this.checkRedis();
        const allHealthy = dbHealth && redisHealth;
        const anyHealthy = dbHealth || redisHealth;
        return {
            status: allHealthy ? 'healthy' : anyHealthy ? 'degraded' : 'unhealthy',
            timestamp: new Date().toISOString(),
            uptime: Math.floor((Date.now() - this.startTime) / 1000),
            version: process.env.npm_package_version || '1.0.0',
            services: {
                database: dbHealth ? 'healthy' : 'unhealthy',
                redis: redisHealth ? 'healthy' : 'unhealthy',
            },
        };
    }
    async getReadiness() {
        const dbHealth = await this.checkDatabase();
        const redisHealth = await this.checkRedis();
        const ready = dbHealth && redisHealth;
        return {
            status: ready ? 'ready' : 'not_ready',
            ready,
        };
    }
    async getLiveness() {
        return {
            status: 'alive',
            alive: true,
        };
    }
    async getDatabaseHealth() {
        const start = Date.now();
        const connected = await this.checkDatabase();
        const latency = Date.now() - start;
        return {
            status: connected ? 'healthy' : 'unhealthy',
            connected,
            latency: connected ? latency : undefined,
        };
    }
    async getRedisHealth() {
        const start = Date.now();
        const connected = await this.checkRedis();
        const latency = Date.now() - start;
        return {
            status: connected ? 'healthy' : 'unhealthy',
            connected,
            latency: connected ? latency : undefined,
        };
    }
    async checkDatabase() {
        try {
            await this.prisma.$queryRaw `SELECT 1`;
            return true;
        }
        catch {
            return false;
        }
    }
    async checkRedis() {
        try {
            await this.cacheManager.set('health_check', 'ok', 1000);
            const value = await this.cacheManager.get('health_check');
            return value === 'ok';
        }
        catch {
            return false;
        }
    }
};
exports.HealthService = HealthService;
exports.HealthService = HealthService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, Object])
], HealthService);
//# sourceMappingURL=health.service.js.map