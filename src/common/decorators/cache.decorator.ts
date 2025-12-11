import { SetMetadata } from '@nestjs/common';

export const CACHE_KEY_METADATA = 'cache_key';
export const CACHE_TTL_METADATA = 'cache_ttl';

/**
 * Cacheable Decorator - Marks a method for caching
 * @param key - Cache key prefix
 * @param ttl - Time to live in seconds (default: 300 = 5 minutes)
 */
export const Cacheable = (key: string, ttl: number = 300) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    SetMetadata(CACHE_KEY_METADATA, key)(target, propertyKey, descriptor);
    SetMetadata(CACHE_TTL_METADATA, ttl)(target, propertyKey, descriptor);
    return descriptor;
  };
};

/**
 * Cache Evict Decorator - Marks a method to clear cache
 * @param keys - Cache keys to clear
 */
export const CacheEvict = (keys: string[]) => {
  return SetMetadata('cache_evict_keys', keys);
};

/**
 * No Cache Decorator - Skips caching for a method
 */
export const NoCache = () => SetMetadata('no_cache', true);

/**
 * Cache key builder helper
 */
export function buildCacheKey(prefix: string, ...parts: (string | number)[]): string {
  return `${prefix}:${parts.join(':')}`;
}

/**
 * Common cache key prefixes
 */
export const CacheKeys = {
  USERS: 'users',
  USER: 'user',
  COURSES: 'courses',
  COURSE: 'course',
  SESSIONS: 'sessions',
  SESSION: 'session',
  ENROLLMENTS: 'enrollments',
  ENROLLMENT: 'enrollment',
  INSTRUCTORS: 'instructors',
  INSTRUCTOR: 'instructor',
  ANALYTICS: 'analytics',
  NOTIFICATIONS: 'notifications',
  TENANTS: 'tenants',
} as const;

/**
 * Cache TTL presets (in seconds)
 */
export const CacheTTL = {
  SHORT: 60,        // 1 minute
  MEDIUM: 300,      // 5 minutes
  LONG: 900,        // 15 minutes
  HOUR: 3600,       // 1 hour
  DAY: 86400,       // 24 hours
} as const;
