import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';

@Component({
    selector: 'app-userReport',
    templateUrl: './userReport.component.html',
    styleUrls: ['./userReport.component.css']
})
export class UserReportComponent implements OnInit {
    loading: boolean = true;
    awaitingApprovalUsers = [];
    approvedUsers = [];
    constructor(public router: Router) {
      

    }
    ngOnInit() {
         let usersRef = firebase.database().ref('users');
        let storageRef = firebase.storage().ref();
        usersRef.orderByChild('userType').equalTo('User').on("value", snapshot => {
            
            this.awaitingApprovalUsers = [];
            this.approvedUsers = [];
            snapshot.forEach(item => {
                var starsRef = storageRef.child('profileImages/' + item.key);
                var user = item.val();
               
                user.key = item.key;
                user.profileImgUrl = 'assets/img/profile.png';
               starsRef.getDownloadURL().then(function (url) {
                    user.profileImgUrl = url;
                });
                if(user.isActive)
                {
                    this.awaitingApprovalUsers.push(user);
                }
                else{
                    this.approvedUsers.push(user);
                }
                return false;
            });
                
            this.loading = false;
        });
         }
}