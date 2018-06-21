import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UserserviceProvider } from '../providers/userservice/userservice';
import * as firebase from 'firebase';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CommonService } from '../shared/common';

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
    users = [];
    userPeople = [];
    heading: string = 'User';
    headingIcon: string = 'fa fa-users fa-icon';
    currentUser: any;
    constructor(public userService: UserserviceProvider, public router: Router, public commonService: CommonService) {  
    }
    ngOnInit() {
        this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        if(this.currentUser.userType == 'User'){
            this.router.navigate(['dashboard']);
        }else{
        let usersRef = firebase.database().ref('users');
        let storageRef = firebase.storage().ref();
        usersRef.orderByValue().on("value", snapshot => {
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

    editUser(user) {
        this.commonService.assginUser(user);
        this.router.navigate(['userDetails']);
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

}
