import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-deshboard',
  templateUrl: './deshboard.component.html',
  styleUrls: ['./deshboard.component.css']
})
export class DeshboardComponent implements OnInit {
   heading: string = 'Deshboard';
    headingIcon: string = 'fa fa-home fa-icon';

  public barChartLabels:string[] = ['Pendding Payment', 'Awaiting Approval', 'Awaiting Final Approval', 'Approved'];
  public barChartType:string = 'polarArea';
  public month:string = 'polarArea';
  public barChartLegend:boolean = true;
  public doughnutChartOptions:{color: [
    'red',    // color for data at index 0
    'blue',   // color for data at index 1
    'green' // color for data at index 2
]};
  public 
 
  public barChartData:any[] = [
    {data: [45, 50, 25, 36], label: 'Number Of Order'},
  ];

  public doughnutChartLabels:string[] = ['Pendding Payment', 'Awaiting Approval', 'Activated'];
  public doughnutChartType:string = 'doughnut';
  public doughnutmonth:string = 'doughnut';
  public doughnutChartLegend:boolean = true;
 
  public doughnutChartData:any[] = [
    {data: [45, 25, 36], label: 'Number Of User'},
  ];
  constructor() { }

  ngOnInit() {
  }

}
