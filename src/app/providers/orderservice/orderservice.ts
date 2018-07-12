import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import * as firebase from 'firebase'

@Injectable()
export class OrderServiceProvider {
    public data: any;
    public fireAuth: any;
    public orderProfile: any;
    public storageRef: any;
    constructor() {
        this.fireAuth = firebase.auth();
        this.orderProfile = firebase.database().ref('orders');
        this.storageRef = firebase.storage().ref();
    }

  approveOrder(order: {}, addAudit: boolean, audit: {}, updateCourier: boolean): any {
    var updates = {};
    updates['orders/' + order['key'] + '/status'] = order['status'];    
    updates['orders/' + order['key'] + '/approvers'] = order['approvers'];

    if(updateCourier){
      updates['orders/' + order['key'] + '/courierName'] = order['courierName'];    
      updates['orders/' + order['key'] + '/driverName'] = order['driverName'];    
      updates['orders/' + order['key'] + '/waybillNumber'] = order['waybillNumber'];    
    }

    if(addAudit){
      updates['orders/' + order['key'] + '/audit/'+ audit['datedes']] = audit['date'];    
      updates['orders/' + order['key'] + '/audit/'+ audit['statusdes']] = true;
    }
    return firebase.database().ref().update(updates);   
  }
}