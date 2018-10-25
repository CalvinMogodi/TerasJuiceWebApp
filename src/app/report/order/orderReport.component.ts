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
    orderNumber = '';
    orderStatus = '';
    statusText = 'Status';
    model: NgbDateStruct;
    model1: NgbDateStruct;
    date: { year: number, month: number };
   
    orderDetail: {
        orderNumber: '',
        cost: '',
        quantity: '',
        dateDisplay: '',
        user: '',
        status: '',
        deliveryMethod: '',
        paymentMethod: '',
        reference: '',
        audit: {
            pendingPaymentDone: false,
            collectedByCourierDate: '',
            awaitingApprovalDone: false,
            readyForDeliveryDone: false,
            collectedByCourierDone: false,
        },
    };
    fromDate;
    orders = [];
    searchForm: FormGroup;
    currentUser: any;
    constructor(public router: Router, public formBuilder: FormBuilder, config: NgbDatepickerConfig) {
        // this.orderDetail.audit = {} 
        this.orderDetail = {
            orderNumber: '',
            cost: '',
            quantity: '',
            dateDisplay: '',
            user: '',
            status: '',
            deliveryMethod: '',
            paymentMethod: '',
            reference: '',
            audit: {
                pendingPaymentDone: false,
                collectedByCourierDate: '',
                awaitingApprovalDone: false,
                readyForDeliveryDone: false,
                collectedByCourierDone: false,
            },
        };
        config.minDate = { year: 1900, month: 1, day: 1 };
        config.maxDate = { year: year, month: month, day: day };

        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();
        var lastDay = new Date(year, month, 0).getDate();
        var day = new Date().getDate();
        var fromStrDate = month + '-' + day + '-' + year + ' 00:00:00';
        var toStrDate = month + '-' + day + '-' + year + ' 23:59:59';
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

    getOrderByOrderNumber(orderNumber) {
        this.loading = true;
        let orderRef = firebase.database().ref('orders');
        orderRef.orderByChild('orderNumber').equalTo(orderNumber).once('value', (snapshot) => {
            this.orders = [];
            var result = snapshot.val();
            if (result != null) {
                snapshot.forEach(snap => {
                    var thisOrder = snap.val();
                    var prop = Object.getOwnPropertyNames(result);
                    thisOrder.key = prop[0];
                    thisOrder.dateDisplay = this.timeConverter(thisOrder.createdDate);
                    this.orders.push(thisOrder);
                    return false;
                });
            }
            this.loading = false;
        });
    }

    clearSearch(){
        this.statusText = 'Status';
        this.orderNumber = ''
        this.model = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };
        this.model1 = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };

         var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();
        var lastDay = new Date(year, month, 0).getDate();
        var day = new Date().getDate();
        var fromStrDate = month + '-' + day + '-' + year + ' 00:00:00';
        var toStrDate = month + '-' + day + '-' + year + ' 23:59:59';
        var fromDate = new Date(fromStrDate);
        var toDate = new Date(toStrDate);

        this.filter(this.toTimestamp(fromDate), this.toTimestamp(toDate));
    }

    selectStatus(orderStatus){
        if (orderStatus != '' && orderStatus != undefined) {
            this.orderStatus = orderStatus;
            this.statusText = orderStatus;
        }else{
            this.statusText = 'Status';
             this.orderStatus = '';
        }      
    }

    filterOrders() {
        if (this.orderNumber != '' && this.orderNumber != undefined) {
            this.getOrderByOrderNumber(Number(this.orderNumber));
        } else {
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

    }

    filter(fromDate, toDate) {
        this.loading = true;
        let usersRef = firebase.database().ref('orders');
        usersRef.orderByChild("createdDate").startAt(fromDate).endAt(toDate).on("value", snapshot => {
            this.orders = [];
            snapshot.forEach(order => {
                var thisOrder = order.val();
                thisOrder.key = order.key;
                thisOrder.dateDisplay = this.timeConverter(thisOrder.createdDate);
                if (this.orderStatus != '' && this.orderStatus != undefined) {
                    if(this.orderStatus == thisOrder.status){
                        this.orders.push(thisOrder);
                    }
                }else{
                    this.orders.push(thisOrder);
                }                
                return false;
            });
            this.loading = false;
        });
    }

    orderDetails(order) {
        this.orderDetail = order;
    }

    timeConverter(timestamp) {
        var a = new Date(timestamp * 1000);
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var hour = a.getHours();
        var min = a.getMinutes();
        var sec = a.getSeconds();
        var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
        return time;
    }
}