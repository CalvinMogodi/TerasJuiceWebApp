import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  displayName: string = '';
  profileImgUrl: string = '';
  constructor( public router: Router) { }

  ngOnInit() {
    var sdf = 0;
     var currentUser = JSON.parse(sessionStorage.getItem('currentUser')); 
     this.displayName = currentUser.name + ' ' + currentUser.surname;    
     this.profileImgUrl = currentUser.profileImgUrl;   
  }

  navigate(url){
      this.router.navigate([url]);
    }

}
