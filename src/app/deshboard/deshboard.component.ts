import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-deshboard',
  templateUrl: './deshboard.component.html',
  styleUrls: ['./deshboard.component.css']
})
export class DeshboardComponent implements OnInit {
   heading: string = 'Deshboard';
    headingIcon: string = 'fa fa-home fa-icon';
  constructor() { }

  ngOnInit() {
  }

}
