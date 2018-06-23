import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import * as firebase from 'firebase'

@Injectable()
export class StockServiceProvider {
    public data: any;
    public fireAuth: any;
    public stockProfile: any;
    public storageRef: any;
    constructor() {
        this.fireAuth = firebase.auth();
        this.stockProfile = firebase.database().ref('stock');
        this.storageRef = firebase.storage().ref();
    }

  updateAvaliableStock(newAmount): any {
    var updates = {};
    updates['manufactureData/avaliableStock/'] = newAmount;    
    return firebase.database().ref().update(updates);   
  }

  updateRejectedStock(newAmount): any {
    var updates = {};
    updates['manufactureData/rejectedStock/'] = newAmount;    
    return firebase.database().ref().update(updates);   
  }

   insertStock(stock: {}): any {
    return this.stockProfile.push(stock);
  }

  getManufactureRecord(): any {
   return firebase.database().ref('/manufactureData').once('value');
  }

}