import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackService {

  status=false;
  email = "";
  constructor(private _http:HttpClient) {}

  communicatemessage(msg:any){
    console.log("Communicate message is called");
    this.email=msg;
  }

  // ****************** GET PRICE**************************************
  
  getprice(name:any):Observable<object>{
    console.log("getprice service function is called"); 
    return this._http.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${name}&apikey=TM0KKBA3TUNIU9US`); 
  }

// ********************* ADDUSER **************************************

  adduser(email:any,stock:any,qty:any,invested:any):Observable<object>{
    console.log("Add user function is called...");
    return this._http.post("http://localhost:3000/user",{id:email,stockname:stock,qty:qty,invested:invested}); 
  }

  // ************** GET STATUS *****************************************

  getstatus(email:any):Observable<object>{
    console.log("Get status is called");
    return this._http.get(`http://localhost:3000/getstatus?id=${email}`)
  }

  // ****************** SELL ******************************************

  sell(email:any,stock:any,qty:any):Observable<object>{
    console.log("Back service of email is called");
    return this._http.post("http://localhost:3000/sell",{id:email,name:stock,qty:qty});
  }

  // ***************** LOGIN ******************************************

  login(email:any,password:any):Observable<object>{
    console.log("back service login function called..."+email+password);
    return this._http.post("http://localhost:3000/login",{email:email,password:password});
  }

// ******************* SIGNUP ******************************************

  signup(email:any,password:any):Observable<object>{
    console.log("back service signup function is called..")
    return this._http.post("http://localhost:3000/signup",{email:email,password:password});
  }

// ******************* RESET PASSWORD ***********************************

  resetpassword(email:any):Observable<object>{
    return this._http.get(`http://localhost:3000/resetpassword?email=${email}`);
  }
}
