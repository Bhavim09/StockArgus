import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BackService } from '../back.service';
import { ToastrService } from 'ngx-toastr';
import ls from 'localstorage-slim';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css'],
})
export class StocksComponent implements OnInit {
  val$: any;  
  stock = '';
  myForm!: FormGroup;
  email: any;
  click = 0;
  price = 0;
  pl: any;
  condition=false;
  stocknames = [
    { name: 'Google', sname: 'goog' },
    { name: 'IBM', sname: 'IBM' },
    { name: 'Jhonson and Jhonson', sname: 'jnj' },
    { name: 'Apple, Inc.', sname: 'aapl' },
    { name: 'Microsoft Corporation', sname: 'msft' },
    { name: 'Amazon.com Inc.', sname: 'amzn' },
    { name: 'NVIDIA Corporation', sname: 'nvda' },
    { name: 'JPMorgan Chase & Co.', sname: 'jpm' },
    { name: 'Visa, Inc.', sname: 'v' },
    { name: 'MasterCard Inc.', sname: 'ma' },
    { name: 'Tesla, Inc.', sname: 'tsla' },
  ];
  stockData:any;
  constructor(
    private backservice: BackService,
    private router: Router,
    private toastr: ToastrService
  ) {
  }

  ngOnInit(): void {
    if (ls.get('#qwAs?.,s', { decrypt: true, secret: 88 }) == '') {
      this.router.navigateByUrl('/');
    }
    this.email = ls.get('#qwAs?.,s', { decrypt: true, secret: 88 });
    console.log(this.email);
    this.myForm = new FormGroup({
      stock: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-zA-Z ]*$'),
      ]),
      qty: new FormControl('', [Validators.required, Validators.minLength(1)]),
    });
  }

  getChangeClass(changePercent: string) {
    const value = parseFloat(changePercent);

    if (value > 0) {
      return 'positive';
    } else if (value < 0) {
      return 'negative';
    }

    return '';
  }
  // ************************ SHOW PRICE FUNCTION ***********************************

  show_price(Form: FormGroup) {
    console.log('Before subscribe');
    this.stock = Form.value.stock;

    // Previous Logic

    // const get = new Promise<any>((resolve, _reject) => {
    //   this.backservice.getprice(Form.value.stock).subscribe(
    //     {
    //       next: res => resolve(res)
    //     }
    //   )
    // })
    // get.then((value) => {
    //   this.val$ = value;
    //   this.price = parseInt(this.val$["Global Quote"]["05. price"]) * 79;
    // })

    // New Logic
    this.backservice.getprice(Form.value.stock).subscribe((values: any) => {
      this.val$ = values;
      // console.log(values["Global Quote"]);
      this.stockData = values["Global Quote"];
      console.log(this.stockData);
      this.price = parseInt(this.val$['Global Quote']['05. price']) * 79;
      this.condition=true;
    });
  }

  // ************************** ADD USER BUYING FUNCTION *************************

  add_userdetail(Form: FormGroup) {
    let pricef: any;
    console.log(typeof Form.value.qty);
    this.backservice.getprice(Form.value.stock).subscribe((value) => {
      this.val$ = value;
      pricef =
        Form.value.qty * parseInt(this.val$['Global Quote']['05. price']) * 79;
        this.backservice
          .adduser(this.email, Form.value.stock, Form.value.qty, pricef)
          .subscribe((value1: any) => {
            console.log(value1);
            if (value1['inres'] == 'successfully updated') {
              this.toastr.success('Stock purchase successful!');
              if (this.click == 1) {
                document.getElementById('forclickremove1')?.remove();
                document.getElementById('forclickremove2')?.remove();
                this.click = 0;
                this.status();
                this.myForm.reset();
              }
            } else {
              this.toastr.error('Select correct stock!');
              Form.reset();
            }
          });
    });
  }

  //*********************** GET THE STATUS OF USER BUYING FUNCTION ***************************

  status() {
    console.log('status function is called!!');
    this.backservice.getstatus(this.email).subscribe((value: any) => {
      if (this.click == 0) {
        console.log('get status (if) condition is called');
        const box = document.getElementById('stocklist');
        const box2 = document.getElementById('overall');
        const el3 = document.createElement('div');
        el3.setAttribute('id', 'forclickremove1');
        const el4 = document.createElement('div');
        el4.setAttribute('id', 'forclickremove2');
        for (const element of value['inddif']) {
          let color = '';
          if (element['diff'] >= 0) {
            color = 'success';
          } else color = 'danger';
          const el = document.createElement('li');
          el.setAttribute(
            'class',
            'list-group-item d-flex justify-content-between align-items-center'
          );
          el.innerHTML = `${element['name']}
                <span class="badge bg-primary rounded-pill">${element['qty']}</span>
        <span class="badge bg-${color} rounded-pill">${element['diff']}</span>`;
          el3?.appendChild(el);
        }
        box?.appendChild(el3);
        console.log(value['P&L']);
        const el2 = document.createElement('div');
        el2.setAttribute(
          'class',
          'list-group-item d-flex justify-content-between align-items-center'
        );

        if (parseInt(value['P&L']) >= 0) {
          el2.innerHTML = `<div class="card opacity-75 text-bg-success mb-3 mx-auto" style="max-width: 24rem;">
          <div class="card-header">OVERALL</div>
          <div class="card-body">
            <h5 class="card-title">Profit of ${value['P&L']}</h5>
          </div>
        </div>`;
        } else {
          el2.innerHTML = `<div class="card opacity-75 text-bg-danger mb-3 mx-auto" style="max-width: 24rem;">
        <div class="card-header">OVERALL</div>
        <div class="card-body">
          <h5 class="card-title">Loss of ${value['P&L']}</h5>
        </div>`;
        }
        el4?.append(el2);
        box2?.appendChild(el4);
        this.click = 1;
      } else {
        document.getElementById('forclickremove1')?.remove();
        document.getElementById('forclickremove2')?.remove();
        this.click = 0;
      }
    });
  }

  // ****************************** SELL STOCK FUNCTION **********************************

  sellstock(Form: FormGroup) {
    let color = 'danger';
    let quote = 'loss';
    this.backservice
      .sell(this.email, Form.value.stock, Form.value.qty)
      .subscribe((value: any) => {
        if (value['pl'] != 'Please enter correct name or qty') {
          this.pl = value['pl'];
          console.log(typeof value['pl']);
          if (parseInt(this.pl) > 0) {
            color = 'success';
            quote = 'profit';
          }
          const box = document.getElementById('pl');
          const el = document.createElement('li');
          el.setAttribute('class', `list-group-item list-group-item-${color}`);
          el.innerHTML = `You have sell on the ${quote} of ${this.pl}`;
          box?.append(el);
          Form.reset();
          if (this.click == 1) {
            document.getElementById('forclickremove1')?.remove();
            document.getElementById('forclickremove2')?.remove();
            this.click = 0;
            this.status();
          }
        } else {
          const box1 = document.getElementById('alertnq');
          const el1 = document.createElement('div');
          el1.innerHTML = ` <div class="alert alert-danger alert-dismissible fade show" role="alert">
            Please enter correct name or quantity
           <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
         </div>`;
          box1?.append(el1);
          Form.reset();
        }
      });
  }

  // ********************** LOGOUT FUNCTION ***********************************

  logout() {
    ls.remove('#qwAs?.,s');
    ls.remove('qsc@1!%^36');
    this.router.navigateByUrl('/');
  }
}
