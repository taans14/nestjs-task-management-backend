import { ExecutionContext, Injectable } from '@nestjs/common';
import { CanActivate } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { USER_ROLES_KEY } from '../decorators/user-roles.decorator';
import { Request } from 'express';
import { Role, User } from 'prisma/generated/client';

export interface AuthRequest extends Request {
  user: User;
}

@Injectable()
export class UserRolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const userRoles = this.reflector.getAllAndOverride<Role[]>(USER_ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!userRoles) return false;

    const request = context.switchToHttp().getRequest<AuthRequest>();
    const user = request.user;

    if (!user) return false;

    return userRoles.includes(user.role as Role);
  }
}
