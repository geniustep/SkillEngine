import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import {
  CACHE_KEY_METADATA,
  CACHE_TTL_METADATA,
} from '../decorators/cache.decorator';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private reflector: Reflector,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    // Check if method is marked with @NoCache
    const noCache = this.reflector.get<boolean>(
      'no_cache',
      context.getHandler(),
    );
    if (noCache) {
      return next.handle();
    }

    // Get cache key from decorator
    const cacheKey = this.reflector.get<string>(
      CACHE_KEY_METADATA,
      context.getHandler(),
    );
    if (!cacheKey) {
      return next.handle();
    }

    // Build full cache key with request params
    const request = context.switchToHttp().getRequest();
    const fullCacheKey = this.buildCacheKey(cacheKey, request);

    // Try to get from cache
    const cachedData = await this.cacheManager.get(fullCacheKey);
    if (cachedData) {
      return of(cachedData);
    }

    // Get TTL from decorator (default: 300 seconds)
    const ttl = this.reflector.get<number>(
      CACHE_TTL_METADATA,
      context.getHandler(),
    ) || 300;

    // Execute handler and cache result
    return next.handle().pipe(
      tap(async (data) => {
        await this.cacheManager.set(fullCacheKey, data, ttl * 1000);
      }),
    );
  }

  private buildCacheKey(prefix: string, request: any): string {
    const parts = [prefix];

    // Add tenant ID if present
    const tenantId = request.headers['x-tenant-id'];
    if (tenantId) {
      parts.push(`tenant:${tenantId}`);
    }

    // Add user ID if authenticated
    if (request.user?.id) {
      parts.push(`user:${request.user.id}`);
    }

    // Add query params
    if (request.query && Object.keys(request.query).length > 0) {
      const queryString = Object.entries(request.query)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => `${k}=${v}`)
        .join('&');
      parts.push(`query:${queryString}`);
    }

    // Add route params
    if (request.params && Object.keys(request.params).length > 0) {
      const paramsString = Object.entries(request.params)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => `${k}=${v}`)
        .join('&');
      parts.push(`params:${paramsString}`);
    }

    return parts.join(':');
  }
}

/**
 * Cache Evict Interceptor - Clears cache on mutations
 */
@Injectable()
export class CacheEvictInterceptor implements NestInterceptor {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private reflector: Reflector,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const evictKeys = this.reflector.get<string[]>(
      'cache_evict_keys',
      context.getHandler(),
    );

    if (!evictKeys || evictKeys.length === 0) {
      return next.handle();
    }

    return next.handle().pipe(
      tap(async () => {
        // Clear cache for all specified keys
        for (const key of evictKeys) {
          await this.clearCacheByPattern(key);
        }
      }),
    );
  }

  private async clearCacheByPattern(pattern: string): Promise<void> {
    // In a real implementation, you would use Redis SCAN to find matching keys
    // For now, we'll just delete the exact key
    try {
      await this.cacheManager.del(pattern);
    } catch (error) {
      console.error(`Failed to clear cache for pattern: ${pattern}`, error);
    }
  }
}
