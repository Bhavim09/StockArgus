import { Component } from "@angular/core";
import { BackService } from "../back.service";
import ls from "localstorage-slim";
import { MatDialog } from "@angular/material/dialog";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
declare var $: any;
@Component({
  selector: "app-status",
  templateUrl: "./status.component.html",
  styleUrls: ["./status.component.css"],
})
export class StatusComponent {
  constructor(
    private modalService: NgbModal,
    private backservice: BackService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private router: Router,
  ) { }
  email: String;
  stockname: any;
  showForm: boolean = false;
  pandLoss: any ;
  totalInvestment: any
  currentValue:any;
  isLoading: boolean = false;
  stockDetails = [
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
  quantity: number | undefined;
  modalFormBuy = new FormGroup({
    quant: new FormControl("", [Validators.required, Validators.min(1)]),
  });

  modalFormSell = new FormGroup({
    quant: new FormControl("", [Validators.required, Validators.min(1)]),
  });

  ngOnInit(): void {
    console.log("ngOnit is called");
    this.isLoading=true;
    this.email = ls.get("#qwAs?.,s", { decrypt: true, secret: 88 });
    this.backservice.getstatus(this.email).subscribe((value: any) => {
      console.log(value[0]);
      this.stockDetails = value;
      let tinvest=0;
      let tpal = 0;
      for(var i=0;i<value.length;i++)
      {
      tinvest+=value[i]["stockValue"];
      tpal+=value[i]["pal"];
      //  this.totalInvestment+= parseInt(value["stocksdetail"][i]["invested"]);
      //  console.log(this.totalInvestment);
      // }
      // this.pandLoss = value["P&L"];
      // this.stockDetails = value["inddif"];
      // console.log(value["indiff"]);
    }
    $('#dataTable').DataTable();
    this.totalInvestment=tinvest;
    this.pandLoss = tpal;
    this.currentValue = this.totalInvestment+this.pandLoss;
    this.isLoading = false;
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
    // this.backservice.news().subscribe((value)=>{
    //   this.cardContent= value["feed"];
    // })

  }

  stockNameAssign(name) {
    this.stockname = name;
    console.log(name);
    // console.log("stockName function is called");
  }
  onBuy() {
    let pricef: any;
    console.log(this.modalFormBuy.value.quant);
    $('#BuyModalCenter').modal('hide');
    this.isLoading=true
    this.backservice.getprice(this.stockname).subscribe((value) => {
      pricef = parseInt(this.modalFormBuy.value.quant) * parseInt(value["Global Quote"]["05. price"])
      console.log(pricef);
      this.backservice
        .addstock(this.email, this.stockname, this.modalFormBuy.value.quant, pricef)
        .subscribe((value1) => {
          console.log(value1);
          if (value1["message"] == "successfully updated") {
            this.toastr.success("Stock purchase successful!");
            this.reloadComponent();
          } else {
            this.isLoading=false;
            this.toastr.error("Stock purchase unsuccessful!");
          }
        });
    });
    // this.modalService.dismissAll();
  }
  onSell() {
    // this.toastr.error("Stock sold successfully!");
    // console.log("Sell button is called...");
    // console.log(this.modalFormSell.value.quant);
    //  this.modalService.dismissAll();
    // $('#SellModalCenter').modal('hide');
    // this.reloadComponent();
    this.backservice.sell(this.email,this.stockname,this.modalFormSell.value.quant).subscribe((value)=>{
      $('#SellModalCenter').modal('hide');
      if(value["pl"]!="Please enter correct name or qty")
      {
        if(value["pl"]>0)
        {
          this.toastr.show(`You have sold on the profit of ${value['pl']}`);
          this.reloadComponent();
        }
        else
        {
          this.toastr.show(`You have sold on the loss of ${value['pl']}`);
          this.reloadComponent();
        }
      }
      else
      {
        this.toastr.error("Please enter correct quantity!");
      }
    })
  }
  funds() {
    this.router.navigateByUrl("/funds");
  }
  stock() {
    this.router.navigateByUrl("/stock");
  }

  reloadComponent() {
    console.log("Reload component is called");
    // Get the current route URL
    const currentRoute = this.router.url;

    // Navigate to the same route to reload the component
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentRoute]);
    });
  }
}
