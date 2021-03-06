import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDatepickerConfig, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as firebase from 'firebase';

@Component({
    selector: 'app-userReport',
    templateUrl: './userReport.component.html',
    styleUrls: ['./userReport.component.css']
})
export class UserReportComponent implements OnInit {
    heading: string = 'User Report';
    headingIcon: string = 'fa fa-address-card fa-icon';
    loadingUserPeople: boolean = false;
    loading: boolean = true;
    users = [];
    userPeople = [];
    currentUser: any;
    model: NgbDateStruct;
    model1: NgbDateStruct;
    date: { year: number, month: number };    

    constructor(public router: Router) {      

    }
    ngOnInit() {

        var month = new Date().getMonth() + 1;
            var year = new Date().getFullYear();
            var lastDay = new Date(year, month, 0).getDate();
            var day = new Date(year, month + 1, 0).getDay();

        this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        if(this.currentUser.userType == 'User'){
            this.router.navigate(['dashboard']);
        }else{
         let usersRef = firebase.database().ref('users');
        let storageRef = firebase.storage().ref();
        usersRef.orderByChild('userType').equalTo('User').on("value", snapshot => {            
            this.users = [];
            snapshot.forEach(item => {
                var starsRef = storageRef.child('profileImages/' + item.key);
                var user = item.val();
                user.key = item.key;
                user.profileImgUrl = 'assets/img/profile.png';
                starsRef.getDownloadURL().then(function (url) {
                    user.profileImgUrl = url;
                });   
                this.users.push(user);             
                return false;
            });                
            this.loading = false;
        });
        }
    }

    viewUserPeople(user){
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

    selectYear(year) {
        let fromDate = new Date('1-1-' + year);
        let toDate = new Date('12-31-' + year);
    }
}