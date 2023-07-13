import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import { AuthGuard } from './auth.guard';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { StocksComponent } from './stocks/stocks.component';
import { BlogsComponent } from './blogs/blogs.component';

const routes: Routes = [
{
  path:'stock',
  component:StocksComponent,
  canActivate:[AuthGuard]

},
{
  path:'',
  component:LandingComponent
},
{
  path:'login',
  component:LoginComponent
},
{
  path:'signup',
  component:SignupComponent
},
{
  path:'landingx`',
  component:LandingComponent  
},
{
  path:'blog',
  component:BlogsComponent
},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
