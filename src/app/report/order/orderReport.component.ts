import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { NgbDatepickerConfig, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'app-orderReport',
    templateUrl: './orderReport.component.html',
    styleUrls: ['./orderReport.component.css']
})
export class OrderReportComponent implements OnInit {
    heading: string = 'Order Report';
    headingIcon: string = 'fa fa-file-text-o fa-icon';
    loading: boolean = true;
    model: NgbDateStruct;
    model1: NgbDateStruct;
    date: { year: number, month: number };
    fromDate;
    pendingPaymentOrders = [];
    awaitingApprovalOrders = [];
    awaitingFinalApprovalOrders = [];
    approvedOrders = [];
    searchForm: FormGroup;
    currentUser: any;
    constructor(public router: Router, public formBuilder: FormBuilder, config: NgbDatepickerConfig) {

        config.minDate = { year: 1900, month: 1, day: 1 };
        config.maxDate = { year: year, month: month, day: day };

        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();
        var lastDay = new Date(year, month, 0).getDate();
        var day = new Date(year, month + 1, 0).getDay();
        var fromStrDate = month + '-' + '1-' + year;
        var toStrDate = month + '-' + lastDay + '-' + year;
        var fromDate = new Date(fromStrDate);
        var toDate = new Date(toStrDate);

        this.filter(this.toTimestamp(fromDate), this.toTimestamp(toDate));
    }
    ngOnInit() {
        this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        if (this.currentUser.userType == 'User') {
            this.router.navigate(['dashboard']);
        } else {
            this.model = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };
            this.model1 = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };
        }
    }

    toTimestamp(strDate) {
        var datum = Date.parse(strDate);
        return datum / 1000;
    }

    filterOrders() {
        var fromMonth = this.model.month.toString();
        var fromYear = this.model.year.toString();
        var fromDay = this.model.day.toString();

        var toMonth = this.model1.month.toString();
        var toYear = this.model1.year.toString();
        var toDay = this.model1.day.toString();

        var fromStrDate = fromMonth + '-' + fromDay + '-' + fromYear;
        var toStrDate = toMonth + '-' + toDay + '-' + toYear;
        var fromDate = new Date(fromStrDate);
        var toDate = new Date(toStrDate);

        this.filter(this.toTimestamp(fromDate), this.toTimestamp(toDate));
    }

    filter(fromDate, toDate) {
        this.loading = true;
        this.pendingPaymentOrders = [];
        this.awaitingApprovalOrders = [];
        this.awaitingFinalApprovalOrders = [];
        this.approvedOrders = [];
        let usersRef = firebase.database().ref('orders');
        usersRef.orderByChild("createdDate").startAt(fromDate).endAt(toDate).on("value", snapshot => {
            snapshot.forEach(order => {
                var thisOrder = order.val();
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
    }
}