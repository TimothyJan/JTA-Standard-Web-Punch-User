import { Component, OnInit } from '@angular/core';
import { JantekService } from '../../../services/jantek.service';

@Component({
  selector: 'app-view-total-hours',
  templateUrl: './view-total-hours.component.html',
  styleUrl: './view-total-hours.component.css'
})
export class ViewTotalHoursComponent implements OnInit{
  totalHours: number;
  noPunches: boolean = false;
  dataFetched: boolean = true;

  constructor(
    private _jantekService: JantekService
  ) {}

  ngOnInit(): void {
    this.getTotalHours();
  }

  /** Get Total Hours */
  getTotalHours(): void {
    this._jantekService.getTotalHours().subscribe(response => {
      if (response.found == 0) {
        // No punches for employee
        this.noPunches = true;
      } else {
        this.noPunches = false;
        this.totalHours = response.hours;
      }

      this.dataFetched = false;
    });
  }

}
