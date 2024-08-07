import { Component, OnInit } from '@angular/core';
import { JantekService } from '../../services/jantek.service';

@Component({
  selector: 'app-date-time',
  templateUrl: './date-time.component.html',
  styleUrl: './date-time.component.css'
})
export class DateTimeComponent implements OnInit{
  dataFetched: boolean = false;
  currentDateTime:Date = new Date();
  timeFormat: string = "";
  dateFormat: string = "";

  constructor(
    private _jantekService: JantekService
  ) {}

  ngOnInit(): void {
    this.getTimeAndDateFormat();
    this.getEmpDateTime();
  }

  /** Gets Time and Date Format from CompanyInfo */
  getTimeAndDateFormat(): void {
    this._jantekService.getCompanyInfo().subscribe(response => {
      this._jantekService.companyInfo = { ...response}
      this.timeFormat = this.timeFormatDisplay(this._jantekService.getTimeFormat());
      this.dateFormat = this._jantekService.dateFormatDisplay(this._jantekService.getDateFormat());
    });
  }

  /** Get Employee DateTime and convert to datetime component */
  getEmpDateTime(): void {
    this._jantekService.getEmpDateTime().subscribe(response => {
      this.convertDateTime(response.datetime);
      this.currentDateTimeUpdate();
      this.dataFetched = true;
    });
  }

  /** Convert Jantek datetime to Javascript date */
  convertDateTime(datetime: string): void {
    let year = Number(datetime.substring(0,4));
    let month = Number(datetime.substring(5,7));
    let day = Number(datetime.substring(8,10));
    let hour = Number(datetime.substring(11,13));
    let minute = Number(datetime.substring(14,16));
    let second = Number(datetime.substring(17,19));
    this.currentDateTime = new Date(year, month, day, hour, minute, second);
  }

  /** Updates currentDateTime every 1 sec */
  currentDateTimeUpdate(): void {
    setInterval(() => {
      this.currentDateTime = new Date();
    }, 1000);
  }

  /** Returns the time format display to be used in the pipe of the time */
  timeFormatDisplay(timeformat: number): string {
    let desc = "";
    if (timeformat === 0) {
      // "am/pm"
      desc = "h:mm:ss a";
    } else {
      // "military"
      desc = "H:mm";
    }
    return desc;
  }

}
