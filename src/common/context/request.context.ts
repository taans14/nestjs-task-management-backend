import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class RequestContext {
  requestId!: string;
  startedAt!: number;

  userId?: string;
  role?: string;
  teamId?: string;
}
