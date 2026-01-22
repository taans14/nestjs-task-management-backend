import { Body, ExecutionContext, Injectable, Scope } from '@nestjs/common';
import { CanActivate } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Request } from 'express';
import { User, TeamRole } from 'prisma/generated/client';
import { TeamsService } from 'src/teams/teams.service';
import { TEAM_ROLES_KEY } from '../decorators/team-roles.decorator';

import { RequestContext as Ctx } from 'src/common/context/request.context';

export interface AuthRequest extends Request {
  user: User;
}

@Injectable({ scope: Scope.REQUEST })
export class TeamRolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly teamsService: TeamsService,
    private readonly ctx: Ctx,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const teamRoles = this.reflector.getAllAndOverride<TeamRole[]>(
      TEAM_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!teamRoles) return false;

    const request = context.switchToHttp().getRequest<AuthRequest>();
    const user = request.user;
    const teamId: string = request.params?.id;

    if (!teamId) return false;

    const membership = await this.teamsService.getTeamRole(user.id, teamId);

    if (!membership) return false;

    console.log(membership.role);

    this.ctx.teamId = teamId;
    this.ctx.role = membership.role;

    return teamRoles.includes(membership.role);
  }
}
