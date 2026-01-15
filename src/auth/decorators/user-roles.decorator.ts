import { SetMetadata } from '@nestjs/common';
import { Role } from 'prisma/generated/client';

export const USER_ROLES_KEY = 'user_roles';
export const UserRoles = (...roles: Role[]) =>
  SetMetadata(USER_ROLES_KEY, roles);
