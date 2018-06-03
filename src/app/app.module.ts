import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule , ReactiveFormsModule} from '@angular/forms';
import { AppRoutingModule } from './app.routing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { provideRoutes, RouterModule} from '@angular/router';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

import { AppComponent } from './app.component';
import { ChartsModule } from 'ng2-charts';
import { NavComponent } from './shared/nav/nav.component';
import { FooterComponent } from './shared/footer/footer.component';
import { LoginComponent } from './login/login.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { DeshboardComponent } from './deshboard/deshboard.component';
import { CreatePolicyComponent } from './policy/createPolicy/createPolicy.component';
import { UserserviceProvider } from './providers/userservice/userservice';
import { OrderServiceProvider } from './providers/orderservice/orderservice';
import { CommonService } from './shared/common';
import { UserComponent } from './user/user.component';
import { UserDetailsComponent } from './user/userDetails/userDetails.component';
import { StockComponent } from './stock/stock.component';
import { OrderComponent } from './order/order.component';
import { UserReportComponent } from './report/user/userReport.component';
import { OrderReportComponent } from './report/order/orderReport.component';
import { ExecutiveReportComponent } from './report/executive/executiveReport.component';

import * as firebase from 'firebase'

export const firebaseConfig = {
    apiKey: "AIzaSyDNZ2-urHkW0xoe9rh9aexpp__FeHybkb8",
    authDomain: "terasherbal-7694e.firebaseapp.com",
    databaseURL: "https://terasherbal-7694e.firebaseio.com",
    projectId: "terasherbal-7694e",
    storageBucket: "terasherbal-7694e.appspot.com",
    messagingSenderId: "303502211142"
};
firebase.initializeApp(firebaseConfig);

@NgModule({
  declarations: [
     AppComponent,
    NavComponent,
    FooterComponent,
    LoginComponent,
    SidebarComponent,
    DeshboardComponent,
    CreatePolicyComponent,
    UserComponent,
    StockComponent,
    UserDetailsComponent,
    OrderComponent,
    UserReportComponent,
    OrderReportComponent,
    ExecutiveReportComponent,
  ],
  imports: [
     BrowserModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFontAwesomeModule,
    ChartsModule,
    NgbModule.forRoot()
  ],
  providers: [
     UserserviceProvider,
    CommonService,
    OrderServiceProvider,
    {provide:LocationStrategy, useClass:HashLocationStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
