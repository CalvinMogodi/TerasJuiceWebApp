import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderServiceProvider } from '../providers/orderservice/orderservice';
import * as firebase from 'firebase';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { APIService } from '../app.apiService';

@Component({
    selector: 'app-order',
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
    heading: string = 'Order';
    headingIcon: string = 'fa fa-list-alt fa-icon';
    loading: boolean = true;
    awaitingApprovalOrders = [];
    awaitingFinalApprovalOrders = [];
    awaitingCourierPickupOrders = [];
    currentUser: any;
    collectionForm: FormGroup;
    orderToCollect: any;
    audit = {
            datedes: '',
            statusdes: '',
            date: '',
        };
    public notification = {
        meaagse: '',
        isSuccessful: false
    };
    constructor(private apiService: APIService, public router: Router, public formBuilder: FormBuilder, public orderService: OrderServiceProvider) {
        this.collectionForm = formBuilder.group({
            courierName: ['', Validators.compose([Validators.required])],
            waybillNumber: ['', Validators.compose([Validators.required])],
            driverName: ['', Validators.compose([Validators.required])],
        });
        this.orderToCollect = {};
        this.orderToCollect.courierName = '';
        this.orderToCollect.waybillNumber = '';
        this.orderToCollect.driverName = '';
    }
    ngOnInit() {
        this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        if (this.currentUser.userType == 'User') {
            this.router.navigate(['dashboard']);
        } else {
                let orderRef = firebase.database().ref('orders');
                orderRef.orderByChild("status").equalTo("Awaiting Approval").on("value", snapshot => {
                    this.awaitingApprovalOrders = [];
                    snapshot.forEach(order => {
                        var thisOrder = order.val();
                        if (thisOrder.status != 'Approved') {
                            thisOrder.key = order.key;
                            thisOrder.dateDisplay = this.timeConverter(thisOrder.createdDate);
                            this.awaitingApprovalOrders.push(thisOrder);
                        }
                        return false;
                    });
                    this.loading = false;
                });
                orderRef.orderByChild("status").equalTo("Awaiting Courier Pickup").on("value", snapshot => {
                    this.awaitingCourierPickupOrders = [];
                    snapshot.forEach(order => {
                        var thisOrder = order.val();
                        if (thisOrder.status != 'Approved') {
                            thisOrder.courierName = '';
                            thisOrder.driverName = '';
                            thisOrder.key = order.key;
                            thisOrder.dateDisplay = this.timeConverter(thisOrder.createdDate);
                            this.awaitingCourierPickupOrders.push(thisOrder);
                        }
                        return false;
                    });
                    this.loading = false;
                });
                if (this.currentUser.userType == 'Manager' || this.currentUser.userType == 'Admin') {
                    orderRef.orderByChild("status").equalTo("Awaiting Final Approval").on("value", snapshot => {
                        this.awaitingFinalApprovalOrders = [];
                        snapshot.forEach(order => {
                            var thisOrder = order.val();
                            if (thisOrder.status != 'Approved') {
                                thisOrder.key = order.key;
                                thisOrder.dateDisplay = this.timeConverter(thisOrder.createdDate);
                                this.awaitingFinalApprovalOrders.push(thisOrder);
                            }
                            return false;
                        });
                        this.loading = false;
                    });
                }
           
        }
    }

    trackByIndex(index) {
        return index;
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

    dateConverter(timestamp) {
        var a = new Date(timestamp * 1000);
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var time = date + ' ' + month + ' ' + year;
        return time;
    }

    approveOrder(order) {
       
        if (order.status == 'Awaiting Approval') {
            order.status = 'Awaiting Final Approval'
            order.approvers = [{
                user: this.currentUser.name + this.currentUser.surname,
            }];
            this.audit.datedes = 'awaitingApprovalDate';
            this.audit.statusdes = 'awaitingApprovalDone';
            this.audit.date = this.timeConverter(this.dateToTimestamp(new Date().toString()));
        } else if (order.status == 'Awaiting Final Approval') {
            order.status = 'Awaiting Courier Pickup'
            if (order.approvers == undefined) {
                order.approvers = [{
                    user: this.currentUser.name + this.currentUser.surname,
                }];
            } else {
                order.approvers.push({
                    user: this.currentUser.name + this.currentUser.surname,
                });
            }
            this.audit.datedes = 'readyForDeliveryDate';
            this.audit.statusdes = 'readyForDeliveryDone';
            this.audit.date = this.timeConverter(this.dateToTimestamp(new Date().toString()));
        }       
        this.orderService.approveOrder(order, true, this.audit).then(result => {
             if (order.status == 'Awaiting Final Approval') {
                 this.notification.meaagse = 'Order is approved successful and waiting for final approval.';
             } else {
                 this.notification.meaagse = 'Order is approved successful and ready for delivery.';
                  this.sendEmail(order);
             }
             this.notification.isSuccessful = true;
         }, error => {
             this.notification.meaagse = 'Unable to approve order.';
             this.notification.isSuccessful = false;
             this.loading = false;
         });
    }
    dateToTimestamp(strDate) {
        var datum = Date.parse(strDate);
        return datum / 1000;
    }

    closeNotification() {
        this.notification.meaagse = '';
    }

    openPOP(orderId) {
        let storageRef = firebase.storage().ref();
        var starsRef = storageRef.child('proofOfPayment/' + orderId);
        starsRef.getDownloadURL().then(url => {
            window.open(url);
        });
    }

    confirmCollection(order) {
        this.orderToCollect = order;           
    }

    submit(){
        if(this.collectionForm.valid){

            let element: HTMLElement = document.getElementById('closeOrderCollection') as HTMLElement;
            element.click();
            this.orderToCollect.status = 'With Courier';
            this.audit.datedes = 'collectedByCourierDate';
            this.audit.statusdes = 'collectedByCourierDone';
            this.audit.date = this.timeConverter(this.dateToTimestamp(new Date().toString()));
            this.orderService.approveOrder(this.orderToCollect, true, this.audit).then(result => {
                this.notification.meaagse = 'Order is updated successful.';
            });
         }
       
    }

    sendEmail(order) {
        let usersRef = firebase.database().ref('users/' + order.userId);
        usersRef.orderByValue().once("value", snapshot => {
            var user = snapshot.val();
            if (user != null) {
                let email = {
                    quantity: order.quantity,
                    orderNumber: order.orderNumber,
                    displayName: user.displayName,
                    address: user.address,
                    invoiceDate: this.dateConverter(order.createdDate),
                    membershipNo: user.membershipNo,
                    cost: order.cost,
                    invoiceNumber: order.orderNumber,
                };
                this.apiService.sendEmail(email).subscribe(data => { })
            }
        });
    }
}