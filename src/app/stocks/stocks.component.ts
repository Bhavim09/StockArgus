import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { BackService } from "../back.service";
import { ToastrService } from "ngx-toastr";
import ls from "localstorage-slim";
import * as FusionCharts from "fusioncharts";


@Component({
  selector: "app-stocks",
  templateUrl: "./stocks.component.html",
  styleUrls: ["./stocks.component.css"],
})
export class StocksComponent implements OnInit {
  hold:number;
  sold: number;
  buy:number;
  val$: any;
  stock = "";
  myForm!: FormGroup;
  email: any;
  click = 0;
  price = 0;
  pl: any;
  meterValue:string="60";
  condition = false;
  isLoading: boolean = false;
  isLoadingBuySell: boolean = false;
  diffPostive: any = [];
  diffNegative: any = [];
  sumOne: number = 0;
  sumTwo: number = 0;
  RS: any;
  RSI: any;
  diffp: any = 0;
  diffn: any = 0;
  RSIP:string;
  
  stocknames = [
    { name: "Google", sname: "goog" },
    { name: "IBM", sname: "IBM" },
    { name: "Jhonson and Jhonson", sname: "jnj" },
    { name: "Apple, Inc.", sname: "aapl" },
    { name: "Microsoft Corporation", sname: "msft" },
    { name: "Amazon.com Inc.", sname: "amzn" },
    { name: "NVIDIA Corporation", sname: "nvda" },
    { name: "JPMorgan Chase & Co.", sname: "jpm" },
    { name: "Visa, Inc.", sname: "v" },
    { name: "MasterCard Inc.", sname: "ma" },
    { name: "Tesla, Inc.", sname: "tsla" },
  ];
  s = [ 
    {title: "Johnson and Johnson",proName: "NYSE:JNJ"},
    {title: "Microsoft",proName: "NASDAQ:MSFT"},
    {title: "Google",proName: "NASDAQ:GOOGL"},
    {title: "IBM",proName: "NYSE:IBM"},
    {title: "Apple",proName: "NASDAQ:AAPL"},
    {title: "Amazon",proName: "NASDAQ:AMZN"},
    {title: "Nvidia",proName: "XETR:NVD"},
    {title: "JP Morgan",proName: "NYSE:JPM"},
    {title: "Adobe Inc.",proName: "NASDAQ:ADBE"}]
  cardContent = [
  ];
  stockData: any;
  constructor(
    private backservice: BackService,
    private router: Router,
    private toastr: ToastrService
  ) {}  

  ngOnInit(): void {
    if (ls.get("#qwAs?.,s", { decrypt: true, secret: 88 }) == "") {
      this.router.navigateByUrl("/");
    }
    this.email = ls.get("#qwAs?.,s", { decrypt: true, secret: 88 });
    console.log(this.email);
    this.myForm = new FormGroup({
      stock: new FormControl("", [
        Validators.required,
        Validators.pattern("^[a-zA-Z ]*$"),
      ]),
      qty: new FormControl("", [Validators.required, Validators.minLength(1)]),
    });
    //Tape Widgit
    const scripttape = document.createElement('script');
    scripttape.src ="https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js"
    scripttape.async = true;
    scripttape.innerHTML = JSON.stringify(
    { 
      symbols: this.s,
      showSymbolLogo :  true,
      colorTheme  :  "dark",
      isTransparent : true,
      displayMode : "adaptive",
      locale : "in"
    });
    const container = document.getElementsByClassName('tradingview-widget-container__widget_tape')[0];
    container.appendChild(scripttape);


    // news api
    
    
    this.backservice.news().subscribe((value)=>{
      this.cardContent= value["feed"];
    })

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
  // *********************** SHOW PRICE FUNCTION ***********************************

  show_price(Form: FormGroup) {
    this.isLoading= true;
    console.log("Before subscribe");
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
    this.backservice.rsiMeter(Form.value.stock).subscribe((value:any)=>{
      const dataObject:any =  Object.values(value["Time Series (Daily)"]);
      for(let i=0; i<14; i++)
    {
      console.log(dataObject[i]);
      console.log(parseFloat(dataObject[i]["4. close"]));
      const diff = parseFloat(dataObject[i+1]["4. close"]) - parseFloat(dataObject[i]["4. close"]);
      if(diff>=0)
      {
        console.log(diff);
        this.diffPostive.push(diff);
      }
      else
      {
        this.diffNegative.push(diff);
      }
    }
    console.log(this.diffPostive);
    console.log(this.diffNegative);
    for(let i=0; i<this.diffPostive.length;i++)
    {
      this.sumOne+=this.diffPostive[i];
    }
    console.log(this.sumOne);
    for(let i=0; i<this.diffNegative.length;i++)
    {
     this.sumTwo+=Math.abs(this.diffNegative[i]);
    }
    console.log(this.sumTwo);
    console.log("RSP "+this.sumOne/this.diffPostive.length);
    console.log("RSN "+this.sumTwo/this.diffNegative.length);
    this.RS = (this.sumOne/this.diffPostive.length)/(this.sumTwo/this.diffNegative.length)
    console.log(this.RS)
    this.RSI = (100 - (100/(1+this.RS)));
    this.RSIP=(this.RSI).toString();
    });


    this.backservice.getprice(Form.value.stock).subscribe((values: any) => {

      this.val$ = values;
      console.log("Value is coming...");
      console.log(values);
      this.stockData = values["Global Quote"];
      console.log(this.stockData);
      this.price = parseInt(this.val$["Global Quote"]["05. price"]) * 79;
      this.condition = true;
      this.isLoading = false;
      FusionCharts.ready(()=> {
        console.log("Inside Fusion chart function")
        console.log(this.meterValue);
        var cSatScoreChart = new FusionCharts({
          type: 'angulargauge',
          renderAt: 'chart-container',
          width: '200',
          height: '200',
          dataFormat: 'json',
          dataSource: {
            "chart": {
              "caption": "",
              "lowerLimit": "0",
              "upperLimit": "100",
              "theme": "fusion",
              "showBorder": "0",
              "gaugeFillMix": "{light-10},{light-20},{light-60},{dark-30},{dark-40}, {dark-40}",
              "showTickMarks": "0",
              "bgColor":"#000000",
        "showTickValues": "0",
        "gaugeBorderColor": "{dark-30}"
            },
            "colorRange": {
              "color": [{
                "minValue": "0",
                "maxValue": "30",
                "code": "#6baa01"
              }, {
                "minValue": "30",
                "maxValue": "70",
                "code": "#f8bd19"
              }, {
                "minValue": "70",
                "maxValue": "100",
                "code": "#e44a00"
              }]
            },
            "dials": {
              "dial": [{
                "value": this.RSIP,
                "bgColor":"#333333"
              }]
            },"annotations": {
              "groups": [
                {
                  "showbelow": "0",
                  "items": [
                    {
                      "id": "buy-label",
                      "type": "text",
                      "text": "BUY",
                      "fontSize": "14",
                      "color": "#008000",
                      "x": "$chartCenterX-30",
                      "y": "$chartCenterY+50"
                    },
                    {
                      "id": "sell-label",
                      "type": "text",
                      "text": "SELL",
                      "fontSize": "14",
                      "color": "#FF0000",
                      "x": "$chartCenterX+30",
                      "y": "$chartCenterY+50"
                    },
                    {
                      "id": "hold-label",
                      "type": "text",
                      "text": "HOLD",
                      "fontSize": "14",
                      "color": "#FFFF00",
                      "x": "$chartCenterX-0",
                      "y": "$chartCenterY-40"
                    }
                  ]
                }
              ]
            }
          }
        }).render();
      });
    });
  }

  // ************************** ADD USER BUYING FUNCTION *************************

  add_userdetail(Form: FormGroup) {
    this.isLoadingBuySell=true;
    let pricef: any;
    console.log(typeof Form.value.qty);
    this.backservice.getprice(Form.value.stock).subscribe((value) => {
      this.val$ = value;
      pricef =
        Form.value.qty * parseInt(this.val$["Global Quote"]["05. price"]);
      this.backservice
        .addstock(this.email, Form.value.stock, Form.value.qty, pricef)
        .subscribe((value1: any) => {
          this.isLoadingBuySell=false;
          console.log(value1);
          if (value1["message"] == "successfully updated") {
            this.toastr.success("Stock purchase successful!");
              this.myForm.reset();
          } else {
            this.toastr.error("Select correct stock!");
            Form.reset();
          }
        });
      });
  }

  //*********************** GET THE STATUS OF USER BUYING FUNCTION ***************************

  status() {
    this.router.navigateByUrl("/status");
  }

  funds() {
    this.router.navigateByUrl("/funds");
  }

  // ****************************** SELL STOCK FUNCTION **********************************

  sellstock(Form: FormGroup) {
    this.isLoadingBuySell=true;
    this.backservice
      .sell(this.email, Form.value.stock, Form.value.qty)
      .subscribe((value: any) => {
        this.isLoadingBuySell=false;
        console.log("Subcribe of sell is called");
        if (value["pl"] != "Please enter correct name or qty") {
          this.toastr.success(`You have succesfully sold at the profit of ${value['pl']}`);
          this.myForm.reset();
        }
        else
        {
          this.toastr.error("Please select correct name and quantity");
          this.myForm.reset();
        }
      });
  }

  // ********************** LOGOUT FUNCTION ***********************************

  logout() {
    ls.remove("#qwAs?.,s");
    ls.remove("qsc@1!%^36");
    this.router.navigateByUrl("/");
  }

  
}
