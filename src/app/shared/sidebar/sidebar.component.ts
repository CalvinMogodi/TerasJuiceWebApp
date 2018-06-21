import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  displayName: string = '';
  activeMenu: Number = 0;
  profileImgUrl: string = '';
  currentUser: any;
  constructor( public router: Router) { }

  ngOnInit() {
    var sdf = 0;
     this.currentUser = JSON.parse(sessionStorage.getItem('currentUser')); 
     this.displayName = this.currentUser.name + ' ' + this.currentUser.surname;    
     this.profileImgUrl = this.currentUser.profileImgUrl;   
  }

  navigate(url){
      this.router.navigate([url]);
    }

}
