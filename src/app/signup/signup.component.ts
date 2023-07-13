import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BackService } from '../back.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  myForm!: FormGroup;

  // ************************* CONSTRUCTOR ****************************************

  constructor(private router: Router, private backservice: BackService) {
    console.log("Signup page is rendered");
  }

  //************************** ngOnInit ********************************************

  ngOnInit(): void {
    this.myForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$')]),
      Repassword: new FormControl('', [Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$')])
    })
  }

  // **************** TO LOGIN FUNCTION ****************************************

  tologin(Form: FormGroup) {
    const get = new Promise<any>((resolve, _reject) => {
      console.log("Checked Promise...")
      this.backservice.signup(Form.value.email, Form.value.password).subscribe(
        {
          next: res => resolve(res)
        }
      )
    })
    get.then((value) => {
      if (value["message"] == "user added") {
        this.router.navigateByUrl('/login');
      }
      else
      {
        console.log("user already existed");
        const box1 = document.getElementById("alertnq");
        const el1 = document.createElement('div');
        el1.innerHTML = ` <div class="alert alert-danger alert-dismissible fade show" role="alert">
        User is already existed
       <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
       </div>`
       box1?.append(el1);
      }
    });
  }
  isFormValid(): Boolean {
    return this.myForm.valid;
  }

}
