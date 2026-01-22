import { ExecutionContext, Injectable, Scope } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { RequestContext as Ctx } from 'src/common/context/request.context';
import { User } from 'prisma/generated/client';

export interface AuthRequest extends Request {
  user: User;
}

@Injectable({ scope: Scope.REQUEST })
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    private readonly ctx: Ctx,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const canActivate = await super.canActivate(context);

    if (!canActivate) return false;

    const req = context.switchToHttp().getRequest<AuthRequest>();
    const user = req.user;

    this.ctx.userId = user.id;

    return true;
  }
}
