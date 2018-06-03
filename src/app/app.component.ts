import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase'

declare const $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isAuthenticated: boolean = false;

  constructor(public router: Router) {
    router.events.subscribe((url:any) => { 
       var currentUser = JSON.parse(sessionStorage.getItem('currentUser'));     
        if (currentUser != null) {    
          this.isAuthenticated = true;
        } else {
          this.isAuthenticated = false;
        }
    });
  }

  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  };
}
