import { Component } from "@angular/core";
import { BackService } from "../back.service";
import ls from 'localstorage-slim';

@Component({
  selector: "app-status",
  templateUrl: "./status.component.html",
  styleUrls: ["./status.component.css"],
})
export class StatusComponent {
  constructor(private backservice: BackService) {}
  pandLoss:any;
  stockDetails = [];
  ngOnInit(): void {
    console.log("ngOnit is called");
    this.backservice
      .getstatus(ls.get('#qwAs?.,s', { decrypt: true, secret: 88 }))
      .subscribe((value: any) => {
        console.log(value);
        this.pandLoss = value["P&L"];
       this.stockDetails = value["inddif"];
      });
  }
}
