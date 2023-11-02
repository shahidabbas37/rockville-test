import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
  Req,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET_KEY } from 'src/config';
type CustomJwtPayload = JwtPayload & { _id: string };
@Injectable()
export class AuthGuardGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization'];
  //  console.log('-------Token', token);

    if (!token) {
      throw new HttpException('Unauthorized', 401);
    }

    try {
      const decodedToken = jwt.verify(token, JWT_SECRET_KEY) as CustomJwtPayload;
      request.user = decodedToken.userId;
    //  console.log('decoded token', decodedToken);
      return true;
    } catch (error) {
      throw new HttpException('Unauthorized', 401);
    }
  }
}
