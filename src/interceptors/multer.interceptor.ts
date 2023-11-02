import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Multer } from 'multer';
import { Observable } from 'rxjs';

@Injectable()
export class MulterInterceptor implements NestInterceptor {
  constructor(private multer: Multer) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const request = http.getRequest();

    return new Observable((observer) => {
      this.multer.single('image')(request, null, (err) => {
        if (err) {
          observer.error(err);
        } else {
          observer.next(request.file);
        }
        observer.complete();
      });
    });
  }
}
