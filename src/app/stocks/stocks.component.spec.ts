import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StocksComponent } from './stocks.component';
import {HttpClientModule,HttpClient} from '@angular/common/http'
import { By } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable, of } from 'rxjs';
import {BackService} from '../back.service';

class MockBackService{
  getprice():Observable<object>{
    return of({ price: "1200" });
  }
  adduser():Observable<object>{
    return of({ inres: "successfully updated" });
  }
}

describe('StocksComponent', () => {
  
  let service:BackService;
  let fixture: ComponentFixture<StocksComponent>;
  let component: StocksComponent;
  beforeEach(async () => {

    // ********************* TESTBED ********************************************

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,HttpClientModule,FormsModule,ReactiveFormsModule,HttpClientTestingModule
      ],
      declarations: [
        StocksComponent
      ],
      providers:[HttpClient,
      {provide:BackService, useClass:MockBackService}
    ]
    }).compileComponents();
    fixture = TestBed.createComponent(StocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); 
  });
  beforeEach(()=>{
    service = TestBed.inject(BackService);
  })

// ************************ UNIT TEST ****************************************

  it('should create', () => {
    const fixture = TestBed.createComponent(StocksComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('Should have a div element with class container',()=>{
    const fixture = TestBed.createComponent(StocksComponent);
    const el = fixture.debugElement.query(By.css('div.container'));
    expect(el).toBeTruthy();
  });


  it('Should have column inside row with div row text-white',()=>{
    const fixture = TestBed.createComponent(StocksComponent);
    const el = fixture.debugElement.query(By.css('.row > div.col > div.text-white'));
    expect(el).toBeTruthy();
  })


  it('Input attribute of stockfield',()=>{
    const fixture = TestBed.createComponent(StocksComponent);
    const el = fixture.debugElement.query(By.css('.px-2  form.justify-content-center  div.--stockname  select.form-control'));
    expect(el).toBeTruthy();
    expect(el.nativeElement.getAttribute('type')).toEqual('text');
  })


  it('Input attribute of quantity field',()=>{
    const el = fixture.debugElement.query(By.css('div.--quantity input.form-control'));
    expect(el).toBeTruthy();
    expect(el.nativeElement.getAttribute('type')).toEqual('number');
  });


  it("Should have a button element having a name STATUS",()=>{
    const fixture = TestBed.createComponent(StocksComponent);
    const el = fixture.debugElement.query(By.css('form.justify-content-center div.cl-btn button.--status'));
    expect(el.nativeElement.innerHTML).toEqual('STATUS');
  });

  it("Should call sellstock function when the SELL button is called",()=>{

    const fixture = TestBed.createComponent(StocksComponent);
    const component = fixture.componentInstance;
    const fnc = spyOn(component,"sellstock");
    const el = fixture.debugElement.query(By.css('form.justify-content-center div.cl-btn button.--sell'));
    el.triggerEventHandler('click',null);
    expect(fnc).toHaveBeenCalled();
  });

  it("Should call show_price function when the checkprice button is called",()=>{

    const fixture = TestBed.createComponent(StocksComponent);
    const component = fixture.componentInstance;
    const fnc = spyOn(component,"show_price");
    const el = fixture.debugElement.query(By.css('form.justify-content-center div.cl-btn button.--checkprice'));
    el.triggerEventHandler('click',null);
    expect(fnc).toHaveBeenCalled();
  });

  it("should call getprice in service class when show_price function is called",()=>{
    const fnc = spyOn(service,'getprice');
    component.show_price(component.myForm);
    fixture.detectChanges();
    expect(fnc).toHaveBeenCalled(); 
  });

  it("should call getprice and adduser in service class when add_userdetail function is called",()=>{
    const fnc = spyOn(service,'getprice');
    const fnc2 = spyOn(service,'adduser');
    component.add_userdetail(component.myForm);
    fixture.detectChanges();
    expect(fnc).toHaveBeenCalled();
  })
});
