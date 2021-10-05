import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

declare var $: any;
@Component({
  selector: 'app-practice',
  templateUrl: './practice.component.html',
  styleUrls: ['./practice.component.css']
})
export class PracticeComponent implements OnInit {


  constructor() { }

  gettime() {
    const duration = moment.duration(26760, 'seconds');
    const resultstring = moment.utc(duration.asMilliseconds()).format('HH:mm:ss');
    console.log(resultstring);
  }


  ngOnInit(): void {
  }

}
