import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PrismaService } from '../../database/prisma.service';

export interface HealthStatus {
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

@Injectable()
export class HealthService {
  private readonly startTime = Date.now();

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getHealth(): Promise<HealthStatus> {
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

  async getReadiness(): Promise<{ status: string; ready: boolean }> {
    const dbHealth = await this.checkDatabase();
    const redisHealth = await this.checkRedis();

    const ready = dbHealth && redisHealth;

    return {
      status: ready ? 'ready' : 'not_ready',
      ready,
    };
  }

  async getLiveness(): Promise<{ status: string; alive: boolean }> {
    return {
      status: 'alive',
      alive: true,
    };
  }

  async getDatabaseHealth(): Promise<{ status: string; connected: boolean; latency?: number }> {
    const start = Date.now();
    const connected = await this.checkDatabase();
    const latency = Date.now() - start;

    return {
      status: connected ? 'healthy' : 'unhealthy',
      connected,
      latency: connected ? latency : undefined,
    };
  }

  async getRedisHealth(): Promise<{ status: string; connected: boolean; latency?: number }> {
    const start = Date.now();
    const connected = await this.checkRedis();
    const latency = Date.now() - start;

    return {
      status: connected ? 'healthy' : 'unhealthy',
      connected,
      latency: connected ? latency : undefined,
    };
  }

  private async checkDatabase(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }

  private async checkRedis(): Promise<boolean> {
    try {
      await this.cacheManager.set('health_check', 'ok', 1000);
      const value = await this.cacheManager.get('health_check');
      return value === 'ok';
    } catch {
      return false;
    }
  }
}

