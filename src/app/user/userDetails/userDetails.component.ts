import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { UserserviceProvider } from '../../providers/userservice/userservice';
import { CommonService } from '../../shared/common';

@Component({
    selector: 'app-userDetails',
    templateUrl: './userDetails.component.html',
    styleUrls: ['./userDetails.component.css']
})
export class UserDetailsComponent implements OnInit {
    loading: boolean = true;
    submitAttempt: boolean = false;
    showError: boolean = false;
    isEdit: boolean = true;
    isUser: boolean = true;
    roles = ["Stcok Capturer", "Admin", "Employee", "Manager"];
    profileImage: any;
    public user: any;
    userForm: FormGroup;
    constructor(public userService: UserserviceProvider, public router: Router, public commonService: CommonService, public formBuilder: FormBuilder) {
        

    }

    ngOnInit() {
        this.user = this.commonService.getUser();
        if (this.user == null) {
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
                password:'usermustchange',
                changePassword: true,
                profileImgUrl: 'assets/img/profile.png'
            }
        }
        else {
            if (this.user.userType != 'User'){
                    this.isEdit = true;
                     this.isUser = false;
            }else{
                
            }
            
        }
        this.userForm = this.formBuilder.group({
            name: [this.user.name, Validators.compose([Validators.required])],
            IDNumber: [this.user.IDNumber, Validators.compose([Validators.required])],
            surname: [this.user.surname, Validators.compose([Validators.required])],
            email: [this.user.email, Validators.compose([Validators.required])],
            cellPhone: [this.user.cellPhone, Validators.compose([Validators.required])],
            userType:[this.user.userType, Validators.compose([Validators.required])],
        });
    }

    back(){
        this.router.navigate(['user']);
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
}