import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-fund-details',
  templateUrl: './fund-details.component.html',
  styleUrls: ['./fund-details.component.css']
})
export class FundDetailsComponent {
  currentBalance: number = 5650;
  usedCredit:number =1000;
  card:boolean=true;
  addCredit = new FormGroup({
    amount: new FormControl("",[])
    });
  constructor(private dialog: MatDialog, private router: Router) { }

  onInit(){

  }
  // Sample function to update the current balance (you may have your own logic)
  updateBalance() {
    this.currentBalance += parseInt(this.addCredit.value.amount);
    $('#creditModal').modal('hide');
  }

  
  portfolio() {
    this.router.navigateByUrl("/status");
  }
  stock() {
    this.router.navigateByUrl("/stock");
  }
}
