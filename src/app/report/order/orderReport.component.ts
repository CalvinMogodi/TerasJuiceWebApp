import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import {NgbDatepickerConfig, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'app-orderReport',
    templateUrl: './orderReport.component.html',
    styleUrls: ['./orderReport.component.css']
})
export class OrderReportComponent implements OnInit {
    loading: boolean = true;
    model: NgbDateStruct;
    model1: NgbDateStruct;
  date: {year: number, month: number};
    fromDate;
    pendingPaymentOrders = [];
    awaitingApprovalOrders = [];
    awaitingFinalApprovalOrders = [];
    approvedOrders = [];
    searchForm: FormGroup;
   
    constructor(public router: Router, public formBuilder: FormBuilder, config: NgbDatepickerConfig) {
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();
        var day = new Date().getDate();

        config.minDate = {year: 1900, month: 1, day: 1};
        config.maxDate = {year: year, month: month, day: day};                   
        this.filter(day + '-' + month + '-' + year, day + '-' + month + '-' + year);
    }
    ngOnInit() {        
        this.model = {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate()};
        this.model1 = {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate()};
    }

    filterOrders() {
        var fromMonth = this.model.month.toString();
        var fromYear = this.model.year.toString();
        var fromDay = this.model.day.toString();

        var toMonth = this.model1.month.toString();
        var toYear = this.model1.year.toString();
        var toDay = this.model1.day.toString();

       this.filter(fromDay + '-' + fromMonth + '-' +  fromYear ,toDay + '-' + toMonth + '-' + toYear);
    }

    filter(fromDate, toDate){
         this.loading = true;
        this.pendingPaymentOrders = [];
        this.awaitingApprovalOrders = [];
        this.awaitingFinalApprovalOrders = [];
        this.approvedOrders = [];
        let priceRef = firebase.database().ref('juicePrice');
        priceRef.orderByValue().on("value", juicePrice => {
            let price = juicePrice.val();
            let usersRef = firebase.database().ref('orders');
            usersRef.orderByChild("createdDate").startAt(fromDate).endAt(toDate).on("value", snapshot => {
                snapshot.forEach(order => {
                    var thisOrder = order.val();
                    thisOrder.cost = price * thisOrder.quantity;
                    thisOrder.key = order.key;
                    switch (thisOrder.status) {
                        case 'Pending Payment':
                            this.pendingPaymentOrders.push(thisOrder);
                            break;
                        case 'Awaiting Approval':
                            this.awaitingApprovalOrders.push(thisOrder);
                            break;
                        case 'Awaiting Final Approval':
                            this.awaitingFinalApprovalOrders.push(thisOrder);
                            break;
                        case 'Approved':
                            this.approvedOrders.push(thisOrder);
                            break;
                    }
                    return false;
                });
                this.loading = false;
            });
        });
    }
}