import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY, RolePermissions } from '../decorators/permissions.decorator';
import { CurrentUserData } from '../decorators/current-user.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  private readonly logger = new Logger(PermissionsGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as CurrentUserData;

    if (!user) {
      throw new ForbiddenException('المستخدم غير موجود');
    }

    // Get user permissions from role
    const userPermissions = this.getUserPermissions(user);

    // Check if user has all required permissions
    const hasAllPermissions = requiredPermissions.every((permission) =>
      userPermissions.includes(permission),
    );

    if (!hasAllPermissions) {
      this.logger.warn(
        `User ${user.id} with role ${user.role} denied access. Required: ${requiredPermissions.join(', ')}`,
      );
      throw new ForbiddenException('ليس لديك صلاحية للقيام بهذا الإجراء');
    }

    return true;
  }

  private getUserPermissions(user: CurrentUserData): string[] {
    // If user has explicit permissions, use them
    if (user.permissions && user.permissions.length > 0) {
      return user.permissions;
    }

    // Otherwise, get permissions from role
    return RolePermissions[user.role] || [];
  }
}

