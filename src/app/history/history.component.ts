import { Component } from '@angular/core';


declare var $: any;
@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent {
  s= [ 
    {title: "Johnson and Johnson",proName: "NYSE:JNJ"},
    {title: "Microsoft",proName: "NASDAQ:MSFT"},
    {title: "Google",proName: "NASDAQ:GOOGL"},
    {title: "IBM",proName: "NYSE:IBM"},
    {title: "Apple",proName: "NASDAQ:AAPL"},
    {title: "Amazon",proName: "NASDAQ:AMZN"},
    {title: "Nvidia",proName: "XETR:NVD"},
    {title: "JP Morgan",proName: "NYSE:JPM"},
    {title: "Adobe Inc.",proName: "NASDAQ:ADBE"}]

    ngOnInit():void{
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

    $('#dataTable').DataTable();
    }
    
}
