import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // Add custom authentication logic here if needed
    // For example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext, status?: any): any {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      // Log the error or info for debugging if necessary
      // console.error('JwtAuthGuard Error:', err);
      // console.error('JwtAuthGuard Info:', info?.message);
      throw err || new UnauthorizedException(info?.message || 'User is not authenticated');
    }
    return user; // This user object is what req.user will become
  }
} 