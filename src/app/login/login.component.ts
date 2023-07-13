import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BackService } from '../back.service';
import { AuthGuard } from '../auth.guard';
import ls from "localstorage-slim";
                                                                                                                                                                    
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  elsecheck = 0;
  myForm!: FormGroup;

// *************** CONSTRUCTOR ************************************************

  constructor(private router: Router, private backservice: BackService, private authg: AuthGuard) { }

//  ************** ngOnInit ***************************************************
  
  ngOnInit(): void {
    this.myForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    })
  }

  // ********************* TO STOCK FUNCTION **********************************

  tostock(Form: FormGroup) {
    const get = new Promise<any>((resolve, _reject) => {
      console.log("Checked Promise...")
      this.backservice.login(Form.value.email, Form.value.password).subscribe(
        {
          next: res => resolve(res)
        }
      )
    })
    get.then((value) => {
      console.log("to stock get.then")
      if (value["message"] == "User logged in") {
        ls.set('#qwAs?.,s', Form.value.email, { encrypt: true, secret: 88 });
        this.backservice.communicatemessage(Form.value.email);
        ls.set('qsc@1!%^36', 'true', { encrypt: true, secret: 88 });
        console.log(value["accessToken"]);
        ls.set('wqewq234!2@',value["accessToken"],{encrypt:true, secret:88});
        this.router.navigateByUrl('/stock');
      }
      else {
        this.elsecheck=1;
        console.log("else statement is called");
        const box1 = document.getElementById("alertnq");
        const el1 = document.createElement('div');
        el1.innerHTML = ` <div class="alert alert-danger alert-dismissible fade show" role="alert">
        Please enter correct email or password
       <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
     </div>`
        box1?.append(el1);
        Form.reset();
      }
    });
  }
 
// *************************** RESET PASSWORD ************************************************

  resetpassword(Form:FormGroup){
    const get = new Promise<any>((resolve, _reject) => {
      console.log("Checked Promise in reset password")
      this.backservice.resetpassword(Form.value.email).subscribe(
        {
          next: res => resolve(res)
        }
      )
    })
    get.then((value) => {
      if(value["message"]=="Reset password email is send")   
      {
        const box1 = document.getElementById("alertnq");
        const el1 = document.createElement('div');
        el1.innerHTML = ` <div class="alert alert-success alert-dismissible fade show" role="alert">
        Please check email for reset password
       <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
     </div>`
      box1?.append(el1);
      }
      else
      {
        const box1 = document.getElementById("alertnq");
        const el1 = document.createElement('div');
        el1.innerHTML = ` <div class="alert alert-danger alert-dismissible fade show" role="alert">
        Enter correct email for reset password
       <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
     </div>`
      box1?.append(el1);
      }
  })
}
  // ****************** IS FORM VALID FUNCTION JUST FOR TESTING *****************************
  
  isFormValid():Boolean{
    return this.myForm.valid;
  }

}
