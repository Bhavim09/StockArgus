import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import ls from "localstorage-slim";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  isUser = false;
  constructor(private router:Router){}
  canActivate() {
    if(ls.get('qsc@1!%^36', { decrypt: true, secret: 88 })=="true")
    {  
    return true;
    }
    else
    {
      this.router.navigateByUrl('/');
      return false;
    }
  }

}
