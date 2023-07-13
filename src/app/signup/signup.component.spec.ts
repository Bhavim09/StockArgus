import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';
import { BackService } from '../back.service';

import { SignupComponent } from './signup.component';


class MockBackService{
  signup():Observable<object>{
    return of({ message: "user added" });
  }
}


describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let service:BackService;

  beforeEach(async () => {
    // ************************* TEST BED **************************************
    
    await TestBed.configureTestingModule({
      imports:[RouterTestingModule,HttpClientModule,FormsModule,ReactiveFormsModule,HttpClientTestingModule],
      declarations: [ SignupComponent ],
      providers:[HttpClient,
        { provide:BackService, useClass:MockBackService }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  beforeEach(async()=>{

    service = TestBed.inject(BackService);
   
    fixture.detectChanges();
  })

  // *********************************UNIT TEST CASES*********************************

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should have div element with class container py-4',()=>{
    const el = fixture.debugElement.query(By.css('.container.py-4'));
    expect(el).toBeTruthy();
  });


  it('should have class form-label for form3Example3 field',()=>{
    const el = fixture.debugElement.query(By.css('.form-outline label.form-label'));
    expect(el).toBeTruthy();
    expect(el.nativeElement.getAttribute('for')).toEqual('form3Example3');
  });


  it('should bind the email to its formcontrol',()=>{
    const el = fixture.debugElement.query(By.css('#form3Example3'));
    const val = component.myForm.get('email');
    const dummyemail = "bhavimdell16@gmail.com";
    val?.setValue(dummyemail);
    fixture.detectChanges();
    expect(el.nativeElement.value).toEqual(dummyemail);
  });
  
  it("should mark email as invalid when it has no value",()=>{
    const ctrl = component.myForm.get('email');
    ctrl?.setValue(null);
    fixture.detectChanges();
    expect(ctrl?.invalid).toBeTruthy();
  });

  it("should mark email as valid when it has some value and proper email",()=>{
    const ctrl = component.myForm.get('email');
    ctrl?.setValue('bhavimdell16@gmail.com');
    fixture.detectChanges();
    expect(ctrl?.valid).toBeTruthy();
  });

  it("should mark password as invalid when it has no value",()=>{
    const ctrl = component.myForm.get('password');
    ctrl?.setValue(null);
    fixture.detectChanges();
    expect(ctrl?.invalid).toBeTruthy();
  });

  it("should call the tologin method when the signupform is submitted",()=>{
    const el = fixture.debugElement.query(By.css('.signup-form'));
    const fnc = spyOn(component,'tologin');
    el.triggerEventHandler('ngSubmit',null);
    expect(fnc).toHaveBeenCalled();
  });

  it("should true when isFormValid is called and the signupform is indeed valid",()=>{
    const dummydata = {
      email:"bhavimdell16@gmail.com",
      password:"qwerty@123",
      Repassword:"qwerty@123"

    };
    component.myForm.patchValue(dummydata);
    fixture.detectChanges();
    expect(component.isFormValid()).toBeTruthy();
  });

  it("should call signup from Backservice when tostock is called",()=>{
    const fnc = spyOn(service,'signup');
    component.tologin(component.myForm);
    expect(fnc).toHaveBeenCalled();
  });

});
