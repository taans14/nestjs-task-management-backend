import { Injectable, NestMiddleware } from '@nestjs/common';
import { RequestContext } from '../context/request.context';
import { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'crypto';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  constructor(private readonly ctx: RequestContext) {}

  use(req: Request, _: Response, next: NextFunction) {
    this.ctx.requestId =
      req.headers['x-request-id']?.toString() ?? randomUUID();

    this.ctx.startedAt = Date.now();
    next();
  }
}
