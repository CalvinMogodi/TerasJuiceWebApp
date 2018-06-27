import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UserserviceProvider } from '../providers/userservice/userservice';
import * as firebase from 'firebase';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgbDatepickerConfig, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../shared/common';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

import 'rxjs/add/operator/map';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css'],
    providers: [UserserviceProvider]
})
export class UserComponent implements OnInit {
    loading: boolean = true;
    loadingUserPeople: boolean = false;
    loadingUserOrders = false;
    users = [];
    userPeople = [];
    userOrders = [];
    heading: string = 'User';
    headingIcon: string = 'fa fa-users fa-icon';
    model: NgbDateStruct;
    model1: NgbDateStruct;
    membershipNo: '';
    date: { year: number, month: number };
    constructor(public userService: UserserviceProvider, public router: Router, public commonService: CommonService, public formBuilder: FormBuilder, public config: NgbDatepickerConfig) {

    }
    ngOnInit() {

        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();
        var lastDay = new Date(year, month, 0).getDate();
        var day = new Date(year, month + 1, 0).getDay();
        var fromStrDate = month + '-' + '1-' + year;
        var toStrDate = month + '-' + lastDay + '-' + year;
        var fromDate = new Date(fromStrDate);
        var toDate = new Date(toStrDate);

        this.config.minDate = { year: 1900, month: 1, day: 1 };
        this.config.maxDate = { year: year, month: month, day: lastDay };
        this.model = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: 1 };
        this.model1 = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: lastDay };
        this.filterUser(this.toTimestamp(fromDate), this.toTimestamp(toDate));
    }

    filter() {
        if (this.membershipNo != '') {
            this.getUserByMembershipNo(this.membershipNo);
        }
        else {
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

            this.filterUser(this.toTimestamp(fromDate), this.toTimestamp(toDate));
        }

    }

    editUser(user) {
        this.commonService.assginUser(user);
        this.router.navigate(['userDetails']);
    }

    toTimestamp(strDate) {
        var datum = Date.parse(strDate);
        return datum / 1000;
    }

    filterUser(fromDate, toDate) {
        this.loading = true;
        let usersRef = firebase.database().ref('users');

        usersRef.orderByChild("createdDate").startAt(fromDate).endAt(toDate).on("value", snapshot => {
            this.users = [];
            snapshot.forEach(item => {

                var user = item.val();
                user.key = item.key;
                user.profileImgUrl = 'assets/img/profile.png';
                if (user.uploadedProfileImage) {
                    let storageRef = firebase.storage().ref();
                    var starsRef = storageRef.child('profileImages/' + item.key);
                    starsRef.getDownloadURL().then(function (url) {
                        user.profileImgUrl = url;
                    });
                }
                this.users.push(user);
                return false;
            });
            this.loading = false;
        });
    }

    viewUserPeople(user) {
        if (user != null) {
            this.loadingUserPeople = true;
            let usersRef = firebase.database().ref('users');
            usersRef.orderByChild('referredBy').equalTo(user.key).once('value', (snapshot) => {
                this.userPeople = [];
                snapshot.forEach(snap => {
                    this.userPeople.push(snap.val());
                });
                this.loadingUserPeople = false;
            });
        }
        this.loadingUserPeople = false;
    }

    getUserByMembershipNo(membershipNo) {
        if (membershipNo != null || membershipNo != undefined) {
            this.users = [];
            this.loading = true;
            let usersRef = firebase.database().ref('users');
            usersRef.orderByChild('membershipNo').equalTo(membershipNo).once('value', (snapshot) => {
                var result = snapshot.val();
                if (result != null) {
                    snapshot.forEach(snap => {
                        var user = snap.val();
                        var prop = Object.getOwnPropertyNames(result);
                        user.key = prop[0];
                        user.profileImgUrl = 'assets/img/profile.png';
                        if (user.uploadedProfileImage) {
                            let storageRef = firebase.storage().ref();
                            var starsRef = storageRef.child('profileImages/' + user.key);
                            starsRef.getDownloadURL().then(function (url) {
                                user.profileImgUrl = url;
                            });
                        }
                        this.users.push(user);
                    });

                }
                this.loading = false;
            });
        }
        this.loadingUserPeople = false;
    }

    viewOrders(user){
         if (user != null) {
            this.loadingUserOrders = true;
            let usersRef = firebase.database().ref('orders');
            usersRef.orderByChild('userId').equalTo(user.key).once('value', (snapshot) => {
                this.userOrders = [];
                snapshot.forEach(snap => {
                    var order = snap.val();
                    order.dateDisplay = this.timeConverter(order.createdDate);
                    this.userOrders.push(order);
                });
                this.loadingUserOrders = false;
            });
        }
        this.loadingUserOrders = false;
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
