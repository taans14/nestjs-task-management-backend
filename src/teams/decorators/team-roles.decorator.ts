import { SetMetadata } from '@nestjs/common';
import { TeamRole } from 'prisma/generated/client';

export const TEAM_ROLES_KEY = 'team_roles';
export const TeamRoles = (...roles: TeamRole[]) =>
  SetMetadata(TEAM_ROLES_KEY, roles);
