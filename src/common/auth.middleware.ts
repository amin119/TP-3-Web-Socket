import { Injectable, NestMiddleware } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['auth-user'] as string;
    console.log('TOKEN:', token);
    console.log('REQ USER:', req['user']);

    if (!token) {
      return res.status(401).json({ message: 'Token is missing' });
    }

    try {
      const decoded = jwt.verify(
        token,
        'mysecret',
      ) as { userId: string };
      if (!decoded.userId) {
        return res.status(403).json({ message: 'Invalid token payload' });
      }
      req['user'] = { id: decoded['userId'] };
      next();
    } catch (err) {
      return res.status(403).json({ message: 'Token is invalid' });
    }
  }
}
