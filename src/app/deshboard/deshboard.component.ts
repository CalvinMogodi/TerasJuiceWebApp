import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-deshboard',
  templateUrl: './deshboard.component.html',
  styleUrls: ['./deshboard.component.css']
})
export class DeshboardComponent implements OnInit {
  heading: string = 'Deshboard';
  headingIcon: string = 'fa fa-home fa-icon';
  userData = {
    penddingPayment: 0,
    awaitingApproval: 0,
    approved: 0,
  };
  orderData = {
    penddingPayment: 0,
    awaitingApproval: 0,
    awaitingFinalApproval: 0,
    approved: 0,
  };
  stockData = {
    manufactured: 0,
    rejected: 0,
    avaliable: 0,
    sold: 0,
  };
  public barChartLabels: string[] = ['Pendding Payment', 'Awaiting Approval', 'Awaiting Final Approval', 'Approved'];
  public barChartType: string = 'polarArea';
  public month: string = 'polarArea';
  public barChartLegend: boolean = true;
  public doughnutChartOptions: {
    color: [
      'red',    // color for data at index 0
      'blue',   // color for data at index 1
      'green' // color for data at index 2
    ]
  };
  
  ordersareloaded = false;
  loading = false;
  loadingUsers = false;
  loadingOrders = false;
  stockisloaded = false;

  public barChartData: any[] = [
    { data: [this.orderData.penddingPayment, this.orderData.awaitingApproval, this.orderData.awaitingFinalApproval, this.orderData.approved], label: 'Number Of Order' },
  ];

  public doughnutChartLabels: string[] = ['Pendding Payment', 'Awaiting Approval', 'Activated'];
  public doughnutChartType: string = 'doughnut';
  public doughnutmonth: string = 'doughnut';
  public doughnutChartLegend: boolean = true;

  public doughnutChartData: any[] = [
    { data: [this.userData.penddingPayment, this.userData.awaitingApproval, this.userData.approved], label: 'Number Of User' },
  ];
  constructor() { }

  ngOnInit() {
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    var lastDay = new Date(year, month, 0).getDate();
    var day = new Date(year, month + 1, 0).getDay(); 
    var fromStrDate =  month+'-' + '1-'+ year;
    var toStrDate = month +'-' + lastDay +'-'+ year;
    var fromDate = new Date(fromStrDate);
    var toDate = new Date(toStrDate);
    this.getStock(this.toTimestamp(fromDate), this.toTimestamp(toDate));
    this.getUsers(this.toTimestamp(fromDate), this.toTimestamp(toDate));
    this.getOrders(this.toTimestamp(fromDate), this.toTimestamp(toDate));
  }

  toTimestamp(strDate){
    var datum = Date.parse(strDate);
    return datum/1000;
  }

  getStock(fromDate, toDate) {
    this.loading = true;
    firebase.database().ref('stock').orderByChild("timestamp").startAt(fromDate).endAt(toDate).on("value", snapshot => {
      this.stockData.manufactured = 0;
      this.stockData.rejected = 0;
      this.stockData.avaliable = 0;
      snapshot.forEach(item => {
        var juice = item.val();
        this.stockData.manufactured = Number(this.stockData.manufactured + Number(juice.newStock));
        this.stockData.rejected = Number(this.stockData.rejected + Number(juice.rejected));
        return false;
      });
      if (this.ordersareloaded) {
        this.stockData.avaliable = this.stockData.manufactured - this.stockData.sold;
        this.loading = false;
      }

      this.stockisloaded = true;
    });

    firebase.database().ref('orders').orderByChild("timestamp").startAt(fromDate).endAt(toDate).on("value", snapshot => {
      this.stockData.avaliable = 0;
      this.stockData.sold = 0;
      snapshot.forEach(item => {
        var order = item.val();
        this.stockData.sold = Number(this.stockData.sold + Number(order.quantity));
        return false;
      });
      if (this.stockisloaded) {
        this.stockData.avaliable = this.stockData.manufactured - this.stockData.sold;
        this.loading = false;
      }
      this.ordersareloaded = true;
    });
  }

   getUsers(fromDate, toDate) {
         let usersRef = firebase.database().ref('users');
        usersRef.orderByChild("timestamp").startAt(fromDate).endAt(toDate).on("value", snapshot => {   
           this.userData = {
              penddingPayment: 0,
              awaitingApproval: 0,
              approved: 0,
            };
            snapshot.forEach(item => {
                var user = item.val();
                if(user.status == 'Awaiting Approval')   
                  this.userData.awaitingApproval = Number(this.userData.awaitingApproval + this.userData.awaitingApproval) ;   
                if(user.status == 'Approved')   
                  this.userData.approved = Number(this.userData.approved + this.userData.approved) ; 
                if(user.status == 'Pending Payment')   
                  this.userData.penddingPayment = Number(this.userData.penddingPayment + this.userData.penddingPayment) ;    
                return false;
            });                
            this.loading = false;
        });
    }

    getOrders(fromDate, toDate) {
         let usersRef = firebase.database().ref('orderd');
        usersRef.orderByChild("timestamp").startAt(fromDate).endAt(toDate).on("value", snapshot => {   
           this.orderData = {
              penddingPayment: 0,
              awaitingApproval: 0,
              awaitingFinalApproval: 0,
              approved: 0,
          };
            snapshot.forEach(item => {
                var order = item.val();    
                 if(order.status == 'Awaiting Approval')   
                  this.orderData.awaitingApproval = Number(this.orderData.awaitingApproval + this.orderData.awaitingApproval) ;   
                if(order.status == 'Approved')   
                  this.orderData.approved = Number(this.orderData.approved + this.orderData.approved) ; 
                if(order.status == 'Pending Payment')   
                  this.orderData.penddingPayment = Number(this.orderData.penddingPayment + this.orderData.penddingPayment) ; 
                if(order.status == 'Awaiting Final Approval')   
                  this.orderData.awaitingFinalApproval = Number(this.orderData.awaitingFinalApproval + this.orderData.awaitingFinalApproval) ;         
                return false;
            });                
            this.loading = false;
        });
    }

}
