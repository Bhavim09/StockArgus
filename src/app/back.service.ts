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
  // ****************** RSI METER *************************************
  rsiMeter(name:string):Observable<object>{
    return this._http.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${name}&outputsize=compact&api\key=TM0KKBA3TUNIU9US`)
    }
// ********************* ADDSTOCK **************************************

  addstock(email:any,stock:any,qty:any,invested:any):Observable<object>{
    console.log("Add user function is called...");
    // const token = localStorage.getItem("wqewq234!2@");
    const body ={email:email,stockName:stock,stockQuantity:qty,stockValue:invested};

    return this._http.post("http://localhost:8080/stocks/registerstock",body
    // {
    //   headers:{
    //     Authorization: `${token}`
    //   }
    // }
    );
  }

  // ************** GET STATUS *****************************************

  getstatus(email:any):Observable<object>{
    console.log("Get status is called");
    return this._http.get(`http://localhost:8080/stocks/user/${email}`)
  }

  // ****************** SELL ******************************************

  sell(email:any,stock:any,qty:any):Observable<object>{
    console.log("sell service is called");
    return this._http.put("http://localhost:8080/stocks/updatestock",{email:email,stockName:stock,stockQuantity:qty});
  }

  // ***************** LOGIN ******************************************

  login(email:any,password:any):Observable<object>{
    console.log("back service login function called..."+email+password);
    return this._http.post("http://localhost:8080/auth/login",{username:email,password:password});
  }

// ******************* SIGNUP ******************************************

  signup(name:any,email:any,password:any):Observable<object>{
    console.log("back service signup function is called..")
    return this._http.post("http://localhost:8080/registeruser",{name:name,email:email,password:password});
  }

// ******************* RESET PASSWORD ***********************************

  resetpassword(email:any):Observable<object>{
    return this._http.get(`http://localhost:3000/resetpassword?email=${email}`);
  }

//  ****************** NEWS **********************************************
news():Observable<object>{
  return this._http.get(`https://www.alphavantage.co/query?function=NEWS_SENTIMENT&limit=10&topics=technology&apikey=YHPB2AUSVV85AFM8`);
}
}
