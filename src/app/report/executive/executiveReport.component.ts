import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';

@Component({
    selector: 'app-executiveReport',
    templateUrl: './executiveReport.component.html',
    styleUrls: ['./executiveReport.component.css']
})
export class ExecutiveReportComponent implements OnInit {
    heading: string = 'Executive Report';
    headingIcon: string = 'fa fa-stack-exchange fa-icon';
    loading: boolean = true;
    ordersData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    moneyData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0];
    public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels:string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  public barChartType:string = 'bar';
  public month:string = 'bar';
  public barChartLegend:boolean = true;
 
  public barChartData:any[] = [
    {data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'Number Of Order'},
    {data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'Money'}
  ];
    constructor(public router: Router) {
        
    }
    ngOnInit() {
        var year = new Date().getFullYear();
        this.filter('1-1-'+year, '31-12-'+year);
    }
    
    // events
  public chartClicked(e:any):void {
    console.log(e);
  }
 
  public chartHovered(e:any):void {
    console.log(e);
  }
 
  public randomize():void {
    // Only Change 3 values
    let data = [
      Math.round(Math.random() * 100),
      59,
      80,
      (Math.random() * 100),
      56,
      (Math.random() * 100),
      40];
    let clone = JSON.parse(JSON.stringify(this.barChartData));
    clone[0].data = data;
    this.barChartData = clone;
    /**
     * (My guess), for Angular to recognize the change in the dataset
     * it has to change the dataset variable directly,
     * so one way around it, is to clone the data, change it and then
     * assign it;
     */
  }

  getMonth(date){
      var test_str = date;
var start_pos = test_str.indexOf('-') + 1;
var end_pos = test_str.indexOf('-',start_pos);
return test_str.substring(start_pos,end_pos);
  }

  selectYear(year){
      this.filter('1-1-' + year, '31-12-' + year)
  }

filter(fromDate, toDate){
    this.ordersData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.moneyData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0];
     let clone = JSON.parse(JSON.stringify(this.barChartData));
                clone[0].data = this.ordersData;
                clone[1].data = this.moneyData;
                this.barChartData = clone;
    this.loading = true;
    let priceRef = firebase.database().ref('juicePrice');
        priceRef.orderByValue().on("value", juicePrice => {
            let price = juicePrice.val();
            let usersRef = firebase.database().ref('orders');
            usersRef.orderByChild("createdDate").startAt(fromDate).on("value", snapshot => {
                snapshot.forEach(order => {
                    var thisOrder = order.val();
                    if(thisOrder.status == 'Approved'){                    
                    thisOrder.cost = price * thisOrder.quantity;
                    var month = Number(this.getMonth(thisOrder.createdDate));
                    thisOrder.key = order.key;
                    switch (month) {
                        case 1:
                            this.ordersData[0] = this.ordersData[0] + 1;
                            this.moneyData[0] = this.moneyData[0] + thisOrder.cost;
                            break;
                        case 2:
                            this.ordersData[1] = this.ordersData[1] + 1;
                            this.moneyData[1] = this.moneyData[1] + thisOrder.cost;
                            break;
                        case 3:
                            this.ordersData[2] = this.ordersData[2] + 1;
                            this.moneyData[2] = this.moneyData[2] + thisOrder.cost;
                            break;
                        case 4:
                            this.ordersData[3] = this.ordersData[3]  + 1;
                            this.moneyData[3]  = this.moneyData[3]  + thisOrder.cost;
                            break;
                        case 5:
                            this.ordersData[4]  = this.ordersData[4]  + 1;
                            this.moneyData[4]  = this.moneyData[4]  + thisOrder.cost;
                            break;
                        case 6:
                            this.ordersData[5]  = this.ordersData[5]  + 1;
                            this.moneyData[5]  = this.moneyData[5]  + thisOrder.cost;
                            break;
                        case 7:
                            this.ordersData[6]  = this.ordersData[6]  + 1;
                            this.moneyData[6]  = this.moneyData[6]  + thisOrder.cost;
                            break;
                        case 8:
                            this.ordersData[7]  = this.ordersData[7]  + 1;
                            this.moneyData[7]  = this.moneyData[7]  + thisOrder.cost;
                            break;
                        case 9:
                            this.ordersData[8]  = this.ordersData[8]  + 1;
                            this.moneyData[8]  = this.moneyData[8]  + thisOrder.cost;
                            break;
                        case 10:
                            this.ordersData[9]  = this.ordersData[9]  + 1;
                            this.moneyData[9]  = this.moneyData[9]  + thisOrder.cost;
                            break;
                        case 11:
                            this.ordersData[10]  = this.ordersData[10]  + 1;
                            this.moneyData[10]  = this.moneyData[10]  + thisOrder.cost;
                            break;
                        case 12:
                            this.ordersData[11]  = this.ordersData[11]  + 1;
                            this.moneyData[11]  = this.moneyData[11]  + thisOrder.cost;
                            break;
                        }
                    }
                    return false;
                });
                let clone = JSON.parse(JSON.stringify(this.barChartData));
                clone[0].data = this.ordersData;
                clone[1].data = this.moneyData;
                this.barChartData = clone;
            });
        });
    }
}