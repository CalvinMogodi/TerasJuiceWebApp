import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderServiceProvider } from '../providers/orderservice/orderservice';
import * as firebase from 'firebase';

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
    currentUser: any;
    public notification = {
        meaagse: '',
        isSuccessful: false
    };
    constructor(public router: Router, public orderService: OrderServiceProvider) {

    }
    ngOnInit() {
        this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        if(this.currentUser.userType == 'User'){
            this.router.navigate(['dashboard']);
        }else{
        let priceRef = firebase.database().ref('juicePrice');
        priceRef.orderByValue().on("value", juicePrice => {
            let price = juicePrice.val();
            let orderRef = firebase.database().ref('orders');

            orderRef.orderByChild("status").equalTo("Awaiting Approval").on("value", snapshot => {
                this.awaitingApprovalOrders = [];
                snapshot.forEach(order => {
                    var thisOrder = order.val();
                    if(thisOrder.status != 'Approved'){
                        thisOrder.cost = price * thisOrder.quantity;
                        thisOrder.key = order.key;
                        if (thisOrder.uploadedPOP) {
                        }
                        this.awaitingApprovalOrders.push(thisOrder);
                    }     
                    return false;
                });
                this.loading = false;
            });
            if(this.currentUser.userType == 'Manager' || this.currentUser.userType == 'Admin'){
                orderRef.orderByChild("status").equalTo("Awaiting Final Approval").on("value", snapshot => {
                this.awaitingFinalApprovalOrders = [];
                snapshot.forEach(order => {
                    var thisOrder = order.val();
                    if(thisOrder.status != 'Approved'){
                        thisOrder.cost = price * thisOrder.quantity;
                        thisOrder.key = order.key;
                        if (thisOrder.uploadedPOP) {
                        }
                        this.awaitingFinalApprovalOrders.push(thisOrder);
                    }     
                    return false;
                });
                this.loading = false;
            });
            }             
        });
    }
    }

    trackByIndex(index) {
        return index;
    }

    approveOrder(order) {


        if (order.status == 'Awaiting Approval') {
            order.status = 'Awaiting Final Approval'
            order.approvers = [{
                user: this.currentUser.name + this.currentUser.surname,
            }]
        } else if (order.status == 'Awaiting Final Approval') {
            order.status = 'Approved'
            if (order.approvers == undefined) {
                order.approvers = [{
                    user: this.currentUser.name + this.currentUser.surname,
                }]
            } else {
                order.approvers.push({
                    user: this.currentUser.name + this.currentUser.surname,
                });
            }

        }
        this.orderService.approveOrder(order).then(result => {
            if (order.status == 'Awaiting Final Approval') {
                this.notification.meaagse = 'Order is approved successful and waiting for final approval.';
            } else {
                this.notification.meaagse = 'Order is approved successful and ready for delivery.';
                //send email to user
            }
            this.notification.isSuccessful = true;
        }, error => {
            this.notification.meaagse = 'Unable to approve order.';
            this.notification.isSuccessful = false;
            this.loading = false;
        });
    }

    closeNotification() {
        this.notification.meaagse = '';
    }
}