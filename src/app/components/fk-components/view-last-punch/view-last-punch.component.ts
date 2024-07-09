import { Component, OnInit } from '@angular/core';
import { JantekService } from '../../../services/jantek.service';

@Component({
  selector: 'app-view-last-punch',
  templateUrl: './view-last-punch.component.html',
  styleUrl: './view-last-punch.component.css'
})
export class ViewLastPunchComponent implements OnInit {
  lastPunchArray: string[];
  lastPunchTime: string;
  lastPunchDate: string;
  lastPunchType: string;
  dataFetched: boolean = true;

  constructor(
    private _jantekService: JantekService
  ) {}

  ngOnInit(): void {
    this.getLastPunch();
  }

  /** Get Last Punch */
  getLastPunch(): void {
    this._jantekService.getLastPunch().subscribe(response => {
      this.lastPunchArray = response.lastpunch.split(' ');
      this.lastPunchTime = this.lastPunchArray[1];
      this.lastPunchDate = this.lastPunchArray[0].replace(',', '');
      this.lastPunchType = this.lastPunchArray[2];
      this.dataFetched = false;
    });
  }
}
