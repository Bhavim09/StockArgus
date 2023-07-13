import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule,HttpClient, HTTP_INTERCEPTORS} from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { StocksComponent } from './stocks/stocks.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { VerifyInterceptor } from './verify.interceptor';
import { LandingComponent } from './landing/landing.component';
import { BlogsComponent } from './blogs/blogs.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



@NgModule({
  declarations: [
    AppComponent,
    StocksComponent,
    LoginComponent,
    SignupComponent,
    LandingComponent,
    BlogsComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass:'toast-top-center'
    })
  ],
  providers: [HttpClient,
  {provide: HTTP_INTERCEPTORS, useClass:VerifyInterceptor, multi:true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
