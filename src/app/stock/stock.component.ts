import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';

@Component({
    selector: 'app-stock',
    templateUrl: './stock.component.html',
    styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {
    stockisloaded: boolean = false;
    ordersareloaded: boolean = false;
    loading: boolean = true;
    juices = [];
    orders = [];
    avaliableTotal: number = 0;
    manufactured: number = 0;
    soldTotal: number = 0;
    months = [];
    monthData = {
        avaliableTotal: 0,
        manufactured: 0,
        soldTotal: 0,
    };
    dayData = {
        avaliableTotal: 0,
        manufactured: 0,
        soldTotal: 0,
    };
    date = {
        day: 0,
        monthName: '',
        month: 0,
        lastDay: 0,
        year: 0
    };
    constructor(public router: Router) {

    }
    ngOnInit() {
        var month = new Date().getMonth();
        var year = new Date().getFullYear();
        var lastDay = new Date(year, month + 1, 0).getDate();
        var day = new Date(year, month + 1, 0).getDay();
        this.date.lastDay = lastDay;
        this.date.day = day;
        this.date.month = month + 1;
        this.date.year = year;

        this.months.push({ id: 1, name: 'January', days: lastDay });
        this.months.push({ id: 2, name: 'February', days: lastDay });
        this.months.push({ id: 3, name: 'March', days: lastDay });
        this.months.push({ id: 4, name: 'April ', days: lastDay });
        this.months.push({ id: 5, name: 'May', days: lastDay });
        this.months.push({ id: 6, name: 'June', days: lastDay });
        this.months.push({ id: 7, name: 'July', days: lastDay });
        this.months.push({ id: 8, name: 'August', days: lastDay });
        this.months.push({ id: 9, name: 'September', days: lastDay });
        this.months.push({ id: 10, name: 'October', days: lastDay });
        this.months.push({ id: 11, name: 'November', days: lastDay });
        this.months.push({ id: 12, name: 'December', days: lastDay });

        for (let month in this.months) {
            var thisMonth = this.months[month];
            if (thisMonth.id == this.date.month) {
                this.date.monthName = thisMonth.name;
                break;
            }
        }

        firebase.database().ref('stock').orderByValue().on("value", snapshot => {
            this.avaliableTotal = 0;
            this.monthData.manufactured = 0;
            snapshot.forEach(item => {
                var juice = item.val();
                this.manufactured = Number(this.manufactured + Number(juice.number));
                var dataCuptured = new Date(juice.dataCuptured);
                if ((dataCuptured.getMonth() + 1) == this.date.month) {
                    this.monthData.manufactured = this.monthData.manufactured + juice.number;
                    if (this.ordersareloaded) {
                        this.monthData.avaliableTotal = this.monthData.manufactured - this.monthData.soldTotal;
                    }
                }
                this.juices.push(juice);
                return false;
            });
            if (this.ordersareloaded) {
                this.avaliableTotal = this.manufactured - this.soldTotal;
                this.loading = false;
            }

            this.stockisloaded = true;
        });

        firebase.database().ref('orders').orderByValue().on("value", snapshot => {
            this.avaliableTotal = 0;
            this.soldTotal = 0;
            this.monthData.avaliableTotal = 0;
            this.monthData.soldTotal = 0;
            snapshot.forEach(item => {
                var order = item.val();
                this.soldTotal = Number(this.soldTotal + Number(order.quantity));
                var createdDate = new Date(order.createdDate);
                if ((createdDate.getMonth() + 1) == this.date.month) {
                    this.monthData.soldTotal = this.monthData.soldTotal + order.quantity;
                    if (this.stockisloaded) {
                        this.monthData.avaliableTotal = this.monthData.manufactured - this.monthData.soldTotal;
                    }
                }

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

    goToNextMonth() {        
        if (this.stockisloaded && this.ordersareloaded) {
            if (this.date.month == 12) {
                this.date.year = this.date.year + 1;
                this.date.month = 1;
            }
            else {
                this.date.month = this.date.month + 1;
            }
            this.date.lastDay = new Date(this.date.year, this.date.month, 0).getDate();
            this.changeDate();
            this.selectedMonthData();
        }
    }

    goToPreviousMonth() {        
        if (this.stockisloaded && this.ordersareloaded) {
            if (this.date.month == 1) {
                this.date.year = this.date.year - 1;
                this.date.month = 12;
            }
            else {
                this.date.month = this.date.month - 1;
            }
            this.date.lastDay = new Date(this.date.year, this.date.month, 0).getDate();
            this.changeDate();
            this.selectedMonthData();
        }
    }

    selectedMonthData() {
        this.monthData.avaliableTotal = 0;
        this.monthData.soldTotal = 0;
        this.monthData.manufactured = 0;
        for (let j in this.juices) {
            var juice = this.juices[j];
            var dataCuptured = new Date(juice.dataCuptured);
            if ((dataCuptured.getMonth() + 1) == this.date.month && (dataCuptured.getFullYear()) == this.date.year) {
                this.monthData.manufactured = this.monthData.manufactured + juice.number;
                if (this.ordersareloaded) {
                    this.monthData.avaliableTotal = this.monthData.manufactured - this.monthData.soldTotal;
                }
            }
        }
        for (let o in this.orders) {
            var order = this.orders[o];
            var createdDate = new Date(order.createdDate);
            if ((createdDate.getMonth() + 1) == this.date.month && (createdDate.getFullYear()) == this.date.year) {
                this.monthData.soldTotal = this.monthData.soldTotal + order.quantity;
                this.monthData.avaliableTotal = this.monthData.manufactured - this.monthData.soldTotal;
            }
        }
    }

    selectedDayData(day: number) {
        if (this.stockisloaded && this.ordersareloaded) {
            this.dayData.avaliableTotal = 0;
            this.dayData.soldTotal = 0;
            this.dayData.manufactured = 0;
            for (let j in this.juices) {
                var juice = this.juices[j];
                var dataCuptured = new Date(juice.dataCuptured);
                if ((dataCuptured.getFullYear()) == this.date.year && (dataCuptured.getMonth() + 1) == this.date.month && (dataCuptured.getDate()) == day) {
                    this.dayData.manufactured = this.dayData.manufactured + juice.number;
                    if (this.ordersareloaded) {
                        this.dayData.avaliableTotal = this.dayData.manufactured - this.dayData.soldTotal;
                    }
                }
            }
            for (let o in this.orders) {
                var order = this.orders[o];
                var createdDate = new Date(order.createdDate);
                if ((createdDate.getFullYear()) == this.date.year && (createdDate.getMonth() + 1) == this.date.month && (createdDate.getDate()) == day) {
                    this.dayData.soldTotal = this.dayData.soldTotal + order.quantity;
                    this.dayData.avaliableTotal = this.dayData.manufactured - this.dayData.soldTotal;
                }
            }
        }
    }

    changeDate() {
        for (let month in this.months) {
            var thisMonth = this.months[month];
            if (thisMonth.id == this.date.month) {
                this.date.monthName = thisMonth.name;
                break;
            }
        }
    }
}