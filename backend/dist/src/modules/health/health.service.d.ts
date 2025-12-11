import { Cache } from 'cache-manager';
import { PrismaService } from '../../database/prisma.service';
interface HealthStatus {
    status: 'healthy' | 'unhealthy' | 'degraded';
    timestamp: string;
    uptime: number;
    version: string;
    services?: {
        database?: 'healthy' | 'unhealthy';
        redis?: 'healthy' | 'unhealthy';
        keycloak?: 'healthy' | 'unhealthy';
    };
}
export declare class HealthService {
    private readonly prisma;
    private cacheManager;
    private readonly startTime;
    constructor(prisma: PrismaService, cacheManager: Cache);
    getHealth(): Promise<HealthStatus>;
    getReadiness(): Promise<{
        status: string;
        ready: boolean;
    }>;
    getLiveness(): Promise<{
        status: string;
        alive: boolean;
    }>;
    getDatabaseHealth(): Promise<{
        status: string;
        connected: boolean;
        latency?: number;
    }>;
    getRedisHealth(): Promise<{
        status: string;
        connected: boolean;
        latency?: number;
    }>;
    private checkDatabase;
    private checkRedis;
}
export {};
