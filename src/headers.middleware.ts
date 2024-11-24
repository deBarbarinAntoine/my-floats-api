
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class HeadersMiddleware implements NestMiddleware {
  use(_req: Request, res: Response, next: NextFunction) {
    res.header('Server', 'NestJS');
    next();
  }
}
