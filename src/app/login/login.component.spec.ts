import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';
import { BackService } from '../back.service';
import { LoginComponent } from './login.component';

class MockBackService{
  login():Observable<object>{
    return of({message: "User logged in", accessToken: "121q@123"});
  }
}


describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let service: BackService;
  let http : HttpClient;
  let httpMock : HttpTestingController;
  let router : Router;
  let activatedRoute :ActivatedRoute;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[RouterTestingModule,HttpClientModule,FormsModule,ReactiveFormsModule,HttpClientTestingModule],
      declarations: [ LoginComponent ],
      providers:[HttpClient,
        { provide:BackService, useClass:MockBackService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  beforeEach(async()=>{

    service = TestBed.inject(BackService);
   
    fixture.detectChanges();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should have div element with class container py-4",()=>{
    const el = fixture.debugElement.query(By.css('.container.py-4'));
    expect(el).toBeTruthy();
  });

  it("should have a class form-label for form2Example1 field",()=>{
    const el = fixture.debugElement.query(By.css('.form-outline label.form-label'));
    expect(el).toBeTruthy();
    expect(el.nativeElement.getAttribute('for')).toEqual('form2Example1');
  });

  it("should bind the email to its Formcontrol",()=>{
    const el = fixture.debugElement.query(By.css("#form2Example1"));
    const ctrl = component.myForm.get('email');
    const dummyemail = "bhavimdell16@gmail.com";
    ctrl?.setValue(dummyemail);
    fixture.detectChanges();
    expect(el.nativeElement.value).toEqual(dummyemail);
    expect((el.nativeElement as HTMLInputElement).value).toEqual(dummyemail);
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

  it("should call the tostock method when the loginform is submitted",()=>{
    const el = fixture.debugElement.query(By.css('.login-form'));
    const fnc = spyOn(component,'tostock');
    el.triggerEventHandler('ngSubmit',null);
    expect(fnc).toHaveBeenCalled();
  });

  it("should true when isFormValid is called and the loginform is indeed valid",()=>{
    const dummydata = {
      email:"bhavimdell16@gmail.com",
      password:"qwerty@123"
    };
    component.myForm.patchValue(dummydata);
    fixture.detectChanges();
    expect(component.isFormValid()).toBeTruthy();
  });

  it("should call login from Backservice when tostock is called",()=>{
    const fnc = spyOn(service,'login');
    component.tostock(component.myForm);
    expect(fnc).toHaveBeenCalled();
  });

  it("should check creation of div element when an error is send through response",fakeAsync(async ()=>{
    spyOn(service,'login').and.returnValue(of({message: "User does not exist"}));
    component.tostock(component.myForm);
    await fixture.detectChanges();
    expect(component.elsecheck).toEqual(1);
  }));
});
