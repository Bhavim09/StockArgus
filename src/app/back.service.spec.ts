import { TestBed } from '@angular/core/testing';
import { BackService } from "./back.service";
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
describe("BackService", () => {
  let service: BackService;
  let httpmock : HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule]
    });
    service = TestBed.inject(BackService);
    httpmock = TestBed.inject(HttpTestingController);
  });
  
  it("should make a post request when /user is called",()=>{
    const dummyemail = "bhavimdell16@gmail.com";
    const dummystock = "IBM";
    const dummyqty = "10";
    const dummyinvested = "1000"
    service.adduser(dummyemail,dummystock,dummyqty,dummyinvested).subscribe(()=>{});
    const req = httpmock.expectOne('http://localhost:3000/user');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({id:dummyemail,stockname:dummystock,qty:dummyqty,invested:dummyinvested})
  });

  it("should make a post request and body should be matched with parameters when /sell is called",()=>{
    const dummyemail = "bhavimdell16@gmail.com";
    const dummystock = "IBM";
    const dummyqty = "10";
    service.sell(dummyemail,dummystock,dummyqty).subscribe(()=>{});
    const req = httpmock.expectOne('http://localhost:3000/sell');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({id:dummyemail,name:dummystock,qty:dummyqty});
  });

  it("should make a get request when /getstatus is called",()=>{
    const dummyemail = "bhavimdell16@gmail.com";
    service.getstatus(dummyemail).subscribe(()=>{});
    const req = httpmock.expectOne(`http://localhost:3000/getstatus?id=${dummyemail}`);
    expect(req.request.method).toEqual('GET');
    expect(req.request.params).not.toBeNull;
  });

  it("should make a post request and body should be matched with parameters when /login is called",()=>{
    const dummyemail = "bhavimdell16@gmail.com";
    const dummypassword = "qwerty@123";
    service.login(dummyemail,dummypassword).subscribe(()=>{});
    const req = httpmock.expectOne('http://localhost:3000/login');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({email:dummyemail,password:dummypassword});
  });

  it("should make a post request and body should be matched with parameters when /signup is called",()=>{
    const dummyemail = "bhavimdell16@gmail.com";
    const dummypassword = "qwerty@123";
    service.signup(dummyemail,dummypassword).subscribe(()=>{});
    const req = httpmock.expectOne('http://localhost:3000/signup');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({email:dummyemail,password:dummypassword});
  });
});
