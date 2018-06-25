import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { DeshboardComponent } from './deshboard/deshboard.component';
import { UserComponent } from './user/user.component';
import { UserDetailsComponent } from './user/userDetails/userDetails.component';
import { StockComponent } from './stock/stock.component';
import { OrderComponent } from './order/order.component';
import { UserReportComponent } from './report/user/userReport.component';
import { OrderReportComponent } from './report/order/orderReport.component';
import { ExecutiveReportComponent } from './report/executive/executiveReport.component';
import { CommissionComponent } from './commission/commission.component'

const routes: Routes =[
    { path: 'dashboard', component: DeshboardComponent },       
    { path: 'user',component: UserComponent },
    { path: 'commission',component: CommissionComponent },
    { path: 'userDetails',component: UserDetailsComponent },
    { path: 'stock',component: StockComponent },  
    { path: 'order',component: OrderComponent },     
    { path: 'userReport',component: UserReportComponent   },  
    { path: 'orderReport',component: OrderReportComponent   },  
    { path: 'executiveReport',component: ExecutiveReportComponent   },  
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
