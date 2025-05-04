import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      throw new ForbiddenException('User not Authenticated');
    }
    if (user.role !== 'admin') {
      throw new ForbiddenException('Access denied. Admins only.');
    }
    return true;
  }
}
