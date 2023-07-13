import { Component,OnInit } from '@angular/core';
import { BackService } from './back.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  

  constructor(private backservice:BackService){
    console.log("Checking console....")
  }

}