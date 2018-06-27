import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-commission',
  templateUrl: './commission.component.html',
  styleUrls: ['./commission.component.css']
})
export class CommissionComponent implements OnInit {
  heading: string = 'Commission';
  loading = true;
  headingIcon: string = 'fa fa-money fa-icon';
  public notification = {
        meaagse: '',
        isSuccessful: false
    };
  users = [];
  constructor() { }

  ngOnInit() {
     var refForUsers = firebase.database().ref('users');
        refForUsers.orderByChild('referrerIsPaid').equalTo(false).on('value', (snapshot) => {
            var snap= snapshot.val();
            this.users = [];
            if (snap != null) {
                snapshot.forEach(snap => {
                  let user = snap.val();                 
                  if(user.isActive){
                    user.dateDisplay = this.timeConverter(user.createdDate);
                    user.payUser = false;
                    user.key = snap.key;
                    let fourMonthsAgo = new Date();
                    let date = new Date(user.dateDisplay);
                    fourMonthsAgo.setMonth(fourMonthsAgo.getMonth() - 2);
                    if(+fourMonthsAgo > +date)
                      user.payUser = true;
                    this.users.push(user);
                  }                    
                }); 
            }
            this.loading = false;
        });
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

    approveUser(user){
       var updates = {};
      updates['users/' + user.key + '/referrerIsPaid'] = true;    
      firebase.database().ref().update(updates);   
      this.notification.isSuccessful = true;
      this.notification.meaagse = 'Referrerr commission has been confirmed';
    }
}
