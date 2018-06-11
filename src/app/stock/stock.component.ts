import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { StockServiceProvider } from '../providers/stockservice/stockservice';
import {NgbDatepickerConfig, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-stock',
    templateUrl: './stock.component.html',
    styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {
    heading: string = 'Stock';
    headingIcon: string = 'fa fa-list-alt fa-icon';
    stockisloaded: boolean = false;
    isAdmin: boolean = false;
    ordersareloaded: boolean = false;
    loading: boolean = true;
    juices = [];
    orders = [];
    avaliableTotal: number = 0;
    manufactured: number = 0;
    soldTotal: number = 0;
    rejected: number = 0;
    model: NgbDateStruct;
    model1: NgbDateStruct;
    searchForm: FormGroup;
    date: {year: number, month: number};
    public notification = {
        meaagse: '',
        isSuccessful: false
    };
    public stock = {
        newStock: '0',
        rejectedStock: '0',
        rejectComment: ''
    }
    stockForm: FormGroup;
    constructor(public router: Router, public formBuilder: FormBuilder, public stockServiceProvider: StockServiceProvider, config: NgbDatepickerConfig) {
    this.stockForm = formBuilder.group({
      newStock: [0],
      rejectedStock: [0],
      rejectComment: ['']
    });
    }
    ngOnInit() {
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();
        var lastDay = new Date(year, month, 0).getDate();
        var day = new Date(year, month + 1, 0).getDay(); 
        this.isAdmin = true;
        
      this.model = {year: year, month: month, day: 1};
      this.model1 = {year: year, month: month, day: lastDay};
      this.filter('1-'+ month +'-'+year, lastDay +'-'+month+'-'+ year);              
    }

     filterStock() {
        var fromMonth = this.model.month.toString();
        var fromYear = this.model.year.toString();
        var fromDay = this.model.day.toString();

        var toMonth = this.model1.month.toString();
        var toYear = this.model1.year.toString();
        var toDay = this.model1.day.toString();

       this.filter(fromDay + '-' + fromMonth + '-' +  fromYear ,toDay + '-' + toMonth + '-' + toYear);
    }

    filter(fromDate, toDate) {
        firebase.database().ref('stock').orderByChild("dateCuptured").startAt(fromDate).endAt(toDate).on("value", snapshot => {
            this.juices = [];   
        this.manufactured = 0;
        this.rejected = 0;
            this.avaliableTotal = 0;            
            snapshot.forEach(item => {
                var juice = item.val();
                this.manufactured = Number(this.manufactured + Number(juice.newStock));
                this.rejected = Number(this.rejected + Number(juice.rejected));
                var dataCuptured = new Date(juice.dataCuptured);               
                this.juices.push(juice);
                return false;
            });
            if (this.ordersareloaded) {
                this.avaliableTotal = this.manufactured - this.soldTotal;
                this.loading = false;
            }

            this.stockisloaded = true;
        });

        firebase.database().ref('orders').orderByChild("createdDate").startAt(fromDate).endAt(toDate).on("value", snapshot => {
            this.avaliableTotal = 0;
            this.soldTotal = 0;           
            snapshot.forEach(item => {
                var order = item.val();
                this.soldTotal = Number(this.soldTotal + Number(order.quantity));
                this.orders.push(order);
                return false;
            });
            if (this.stockisloaded) {
                this.avaliableTotal = this.manufactured - this.soldTotal;
                this.loading = false;
            }
            this.ordersareloaded = true;
        });       
    }

   
    submit(){
        this.notification.meaagse = ''; 
        if(this.stock.newStock == '')
            this.stock.newStock = '0';
         if(this.stock.rejectedStock == '')
            this.stock.rejectedStock = '0';

        if(Number(this.stock.newStock) > 0 || Number(this.stock.rejectedStock) > 0){
            var currentUser = JSON.parse(sessionStorage.getItem('currentUser')); 
            var year = new Date().getFullYear().toString();
            var month = (new Date().getMonth() + 1).toString();
            var day = new Date().getDate().toString();
            var stock = {
                dateCuptured: day + '-' + month + '-' +  year,
                rejected: Number(this.stock.rejectedStock),
                rejectComment: Number(this.stock.rejectedStock) == 0 ? '' : this.stock.rejectComment,
                newStock: Number(this.stock.newStock),
                user: currentUser.name +' '+ currentUser.surname,
            };
            this.stockServiceProvider.insertStock(stock).then(result => { 
                this.stockServiceProvider.getManufactureRecord().then(snapshot => {

                    var record = snapshot.val();
                    this.notification.meaagse = 'Records has been saved successful.';
                    this.notification.isSuccessful = true;

                    var avaliableStock = record.avaliableStock;
                    var rejectedStock = record.rejectedStock;
                    if(Number(this.stock.newStock) > 0)
                        avaliableStock = avaliableStock + Number(this.stock.newStock);
                    if(Number(this.stock.rejectedStock) > 0){
                        avaliableStock = avaliableStock - Number(this.stock.rejectedStock);
                        rejectedStock = rejectedStock + Number(this.stock.rejectedStock);
                    }

                     if(Number(this.stock.newStock) != avaliableStock){
                        this.stockServiceProvider.updateAvaliableStock(avaliableStock);
                    }
                     if(Number(this.stock.rejectedStock) != rejectedStock){
                        this.stockServiceProvider.updateRejectedStock(rejectedStock);
                    }    

                    this.stock.newStock = '0';    
                    this.stock.rejectedStock = '0';         
                });
          }, error => {       
             this.notification.meaagse = 'Records is not saved successful.';
                 this.notification.isSuccessful = false;
        });;
        }        
    }
}