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

  approveOrder(order: {}, addAudit: boolean, audit: {}): any {
    var updates = {};
    updates['orders/' + order['key'] + '/status'] = order['status'];    
    updates['orders/' + order['key'] + '/approvers'] = order['approvers'];

    if(addAudit){
      updates['orders/' + order['key'] + '/audit/'+ audit['datedes']] = audit['date'];    
      updates['orders/' + order['key'] + '/audit/'+ audit['statusdes']] = true;
    }
    return firebase.database().ref().update(updates);   
  }
}