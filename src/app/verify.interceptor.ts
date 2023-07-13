import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import ls from "localstorage-slim";

@Injectable()
export class VerifyInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
   const re = /login|resetpassword/;
   if(request.url.search(re)===-1)
   {
    console.log("call made by interceptor");

    const tokenizedreq = request.clone({ headers: request.headers.set('Authorization',ls.get('wqewq234!2@', { decrypt: true, secret: 88 })! ) });
    return next.handle(tokenizedreq);
   }
   else
   {
    return next.handle(request);
   }
  }
}
