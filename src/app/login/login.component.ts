import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserserviceProvider } from '../providers/userservice/userservice';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import * as firebase from 'firebase'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  showLogin: boolean = true;
  showForgotPassword: boolean = false;
  showRegisterUser: boolean = false;
  showChangePassword: boolean = false;
  showOTP: boolean = false;
  loginForm: FormGroup;
  changePasswordForm: FormGroup;
  submitAttempt: boolean = false;
  cpSubmitAttempt: boolean = false;
  showError: boolean = false;
  loading: boolean = false;
  disableChangePassword: boolean = true;
  errorStr: string = '';
  showPasswordError: boolean = false;
  showPasswordsError: boolean = false;
  cpShowError: boolean = false;
  userId: string = '';
  public user = {
    email: '',
    password: '',
  }

  public cpUser = {
    cpPassword: '',
    cpConfirmPassword: '',
  }

  constructor(public userService: UserserviceProvider, public router: Router, public formBuilder: FormBuilder) {
    this.loginForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])],
    });

    this.changePasswordForm = formBuilder.group({
      cpPassword: ['', Validators.compose([Validators.required])],
      cpConfirmPassword: ['', Validators.compose([Validators.required])],
    });
  }

  ngOnInit() {

  }

  OpenAction(action) {
    this.showLogin = false;
    this.showForgotPassword = false;
    this.showRegisterUser = false;
    this.showChangePassword = false;
    this.showOTP = false;
    switch (action) {
      case 'OTP':
        this.showOTP = true;
        break;
      case 'Forgot Password':
        this.showForgotPassword = true;
        break;
      case 'Register User':
        this.showRegisterUser = true;
        break;
      case 'Change Password':
        this.showChangePassword = true;
        break;
      default:
        this.showLogin = true;
    }
  }

  SignUp() {
    //this.OpenAction('Login');
    sessionStorage.setItem('currentUser', JSON.stringify({ isAuthenticated: true, userType: 'superUser' }));
    this.router.navigate(['createNewPolicy']);
  }

  Login() {
    this.submitAttempt = true;
    this.showError = false;
    if (this.loginForm.valid) {
      this.loading = true;
      this.userService.loginUser(this.user.email, this.user.password).then(authData => {        
        var scope = this;
        firebase.database().ref('/users/' + authData.user.uid).once('value').then(snapshot => {
          var user = snapshot.val();
          if(user != null){
          user.key = authData.uid;
          scope.userId = user.key;
          let starsRef = firebase.storage().ref().child('profileImages/' + authData.user.uid);
          starsRef.getDownloadURL().then(url => {
            user.profileImgUrl = url;
            scope.navigateUser(user);
          }).catch(function (error) {
            user.profileImgUrl = 'assets/img/profile.png';
            scope.navigateUser(user);
          });
        }else{
          this.showError = true;
        }
          this.loading = false;
        });
      }, error => {
        this.showError = true;
        this.loading = false;
      });
    }
  }

  navigateUser(user): any {
    if (user.changedPassword) {
      sessionStorage.setItem('currentUser', JSON.stringify(user));
      this.router.navigate(['/dashboard']);
    } else {
      this.OpenAction('Change Password');
    }
  }

  ForgotPassword() {
    this.OpenAction('Change Password');
  }

  ChangePassword() {
    this.cpSubmitAttempt = true;
    this.cpShowError = false;
    if (this.changePasswordForm.valid) {
        this.userService.changeUserPassword(this.cpUser.cpPassword).then(result =>{
          this.userService.changeUserLogin(this.userId);
          this.userService.signOut();
          this.OpenAction('Login');
        } );
    }
  }

  validatePasswor() {
    this.showPasswordError = false;
    this.showPasswordsError = false;
    this.disableChangePassword = true;
    if (this.cpUser.cpPassword != undefined) {

      // Validate lowercase letters
      var lowerCaseLetters = /[a-z]/g;
      if (!this.cpUser.cpPassword.match(lowerCaseLetters)) {
        this.showPasswordError = true;
      }
      // Validate capital letters
      var upperCaseLetters = /[A-Z]/g;
      if (!this.cpUser.cpPassword.match(upperCaseLetters)) {
        this.showPasswordError = true;
      }
      // Validate numbers
      var numbers = /[0-9]/g;
      if (!this.cpUser.cpPassword.match(numbers)) {
        this.showPasswordError = true;
      }
      // Validate length
      if (this.cpUser.cpPassword.length <= 6) {
        this.showPasswordError = true;
      }
      if(!this.showPasswordError){
          this.disableChangePassword = false;
      }
    }
    if (this.cpUser.cpPassword != "" && this.cpUser.cpConfirmPassword != "") {
      if (this.cpUser.cpPassword != this.cpUser.cpConfirmPassword) {
        this.showPasswordsError = true;
        this.disableChangePassword = true;
      }
    }
  }

  Submit() {
    sessionStorage.setItem('currentUser', JSON.stringify({ isAuthenticated: true, userType: 'superUser' }));
    this.router.navigate(['createNewPolicy']);
  }
}
