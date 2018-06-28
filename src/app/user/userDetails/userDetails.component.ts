import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { UserserviceProvider } from '../../providers/userservice/userservice';
import { CommonService } from '../../shared/common';
import * as firebase from 'firebase';
import { APIService } from '../../app.apiService';

@Component({
    selector: 'app-userDetails',
    templateUrl: './userDetails.component.html',
    styleUrls: ['./userDetails.component.css']
})
export class UserDetailsComponent implements OnInit {
    heading: string = 'User Details';
    headingIcon: string = 'fa fa-users fa-icon';
    loading: boolean = true;
    submitAttempt: boolean = false;
    showError: boolean = false;
    isEdit: boolean = true;
    isUser: boolean = true;
    roles = ["Stcok Capturer", "Admin", "Employee", "Manager"];
    profileImage: any;
    public user: any;
    userForm: FormGroup;
    currentUser: any;
    private webApiUrl: string;
    constructor(private apiService: APIService , public userService: UserserviceProvider, public router: Router, public commonService: CommonService, public formBuilder: FormBuilder) {
        this.webApiUrl = 'http://localhost:7777/api/';

    }

    ngOnInit() {
        this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        if (this.currentUser.userType == 'User') {
            this.router.navigate(['dashboard']);
        } else {
            this.user = this.commonService.getUser();
            if (this.user == null) {
                this.heading = 'Add New User';
                this.isEdit = false;
                this.isUser = false;
                this.user = {
                    isActive: false,
                    email: '',
                    name: '',
                    IDNumber: '',
                    surname: '',
                    userType: 'Employee',
                    cellPhone: '',
                    password: 'usermustchange',
                    profileImgUrl: 'assets/img/profile.png',
                    points: 0,
                    displayName: '',
                    uploadedIDNumberPassport: false,
                    uploadedProfileImage: false,
                    uploadedPOP: false,
                    createdDate: 0,
                    changedPassword: false
                }
            }
            else {
                if (this.user.userType != 'User') {
                    this.heading = 'Edit User';
                    this.isEdit = true;
                    this.isUser = false;
                } else {
                }
            }
            this.userForm = this.formBuilder.group({
                name: [this.user.name, Validators.compose([Validators.required])],
                IDNumber: [this.user.IDNumber, Validators.compose([Validators.required])],
                surname: [this.user.surname, Validators.compose([Validators.required])],
                email: [this.user.email, Validators.compose([Validators.required])],
                cellPhone: [this.user.cellPhone, Validators.compose([Validators.required])],
                userType: [this.user.userType, Validators.compose([Validators.required])],
            });
        }
    }

    back() {
        this.router.navigate(['user']);
    }

    openPOP() {
        let storageRef = firebase.storage().ref();
        var starsRef = storageRef.child('initiationFee/' + this.user.key);
        starsRef.getDownloadURL().then(url => {
            window.open(url);
        });
    }

    fileChangeEvent(fileInput: any) {
        if (fileInput.target.files && fileInput.target.files[0]) {
            var reader = new FileReader();
            reader.onload = (event: any) => {
                this.user.profileImgUrl = event.target.result;
            }
            reader.readAsDataURL(fileInput.target.files[0]);
        }
        this.profileImage = fileInput.target.files[0];
    }

    createUser() {
        this.submitAttempt = true;
        this.showError = false;
        if (this.userForm.valid) {
            this.userService.insertUser(this.user, this.profileImage).then(userId => {
                this.back();
            }, error => {
                this.showError = true;
                this.loading = false;
            });
        }
    }

    approveUser() {
        this.submitAttempt = true;
        this.showError = false;
        this.sendSMS();
        this.userService.approveUser(this.user.key).then(userId => {
            this.back();
        }, error => {
            this.showError = true;
            this.loading = false;
        });

    }

    updateUser() {
        this.submitAttempt = true;
        this.showError = false;
        if (this.userForm.valid) {
            this.userService.updateUser(this.user, this.profileImage).then(userId => {
                this.back();
            }, error => {
                this.showError = true;
                this.loading = false;
            });
        }
    }

     sendSMS() {
        var sms = {
            number: this.user.cellPhone,
            displayName: this.user.displayName
        }
        this.apiService.sendSMS(sms).subscribe(data =>{})        
    }    
}