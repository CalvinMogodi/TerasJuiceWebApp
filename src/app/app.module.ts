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
import { UserserviceProvider } from './providers/userservice/userservice';
import { OrderServiceProvider } from './providers/orderservice/orderservice';
import { StockServiceProvider } from './providers/stockservice/stockservice';
import { CommonService } from './shared/common';
import { UserComponent } from './user/user.component';
import { UserDetailsComponent } from './user/userDetails/userDetails.component';
import { StockComponent } from './stock/stock.component';
import { OrderComponent } from './order/order.component';
import { UserReportComponent } from './report/user/userReport.component';
import { OrderReportComponent } from './report/order/orderReport.component';
import { ExecutiveReportComponent } from './report/executive/executiveReport.component';
import { CommissionComponent } from './commission/commission.component'
import * as firebase from 'firebase';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import { HttpModule } from '@angular/http';
import { APIService } from './app.apiService';

export const firebaseConfig = {
  apiKey: "AIzaSyAG_crKE7xA6cevn4x1FbgFVXKtDSD_zhM",
  authDomain: "terasherbaljuice.firebaseapp.com",
  databaseURL: "https://terasherbaljuice.firebaseio.com",
  projectId: "terasherbaljuice",
  storageBucket: "terasherbaljuice.appspot.com",
  messagingSenderId: "939142186985"
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
    UserComponent,
    StockComponent,
    UserDetailsComponent,
    OrderComponent,
    UserReportComponent,
    OrderReportComponent,
    ExecutiveReportComponent,
    CommissionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
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
    StockServiceProvider,
    {provide:LocationStrategy, useClass:HashLocationStrategy},
    APIService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
