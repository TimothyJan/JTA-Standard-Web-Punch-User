import { Injectable } from '@angular/core';
import { AlertService } from './alert.service';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { PunchConfig } from '../models/punch-config';
import { FunctionKey } from '../models/function-key';
import { CompanyInfo } from '../models/company-info';
import { CodeList } from '../models/code-list';
import { CodeStatus, L3CodeStatus } from '../models/code-status';
import { EmployeeStatus } from '../models/employee-status';
import { DateTimeStatus } from '../models/datetime-status';
import { LastPunch } from '../models/last-punch';
import { TotalHours } from '../models/total-hours';

/** LAN server janteksvr04 */
// const APIROOT = "http://201.12.20.40/timothy_jan/webpunch/api";
const APIROOT = "/api";
/** Internet server janteksvr00 */
// const APIROOT = "http://newdev.jantek.net/webpunch/api";
const COMPANYNAME = "TIMOTHYJANPROJECT";

@Injectable({
  providedIn: 'root'
})
export class JantekService {
  isAuthenticatedChange: Subject<boolean> = new Subject<boolean>();
  companyName:string = "";

  companyInfo: CompanyInfo;
  punchConfiguration: PunchConfig

  employeeStatus: EmployeeStatus = {
    status: "",
    cardnum: 0,
    found: 0,
    empid: "",
    lastname: "",
    firstname: ""
  }

  constructor(
    private _alertService: AlertService,
    private http: HttpClient
  ) { }

  /** Checks if Employee ID exists */
  getEmployeeIDStatus(employeeID: string): Observable<EmployeeStatus> {
    const options = {
      params: {
        Company: COMPANYNAME,
        EmpID:employeeID,
      }
    };
    return this.http.get<EmployeeStatus>(`${APIROOT}/wp_chkempid.asp`, options);
  }

  /** Checks if Employee ID exists */
  getCardNumberStatus(cardNumber: number): Observable<EmployeeStatus> {
    const options = {
      params: {
        Company: COMPANYNAME,
        cardnum: cardNumber,
      }
    };
    return this.http.get<EmployeeStatus>(`${APIROOT}/wp_chkcardnum.asp`, options);
  }

  /** Authenticate to access other functions */
  login(): void {
    this.isAuthenticatedChange.next(true);
    this._alertService.openSnackBar("Login Successful");
  }

  /** Login information is incorrect */
  invalidLogin(): void {
    this.isAuthenticatedChange.next(false);
    this._alertService.openSnackBar("Invalid Login");
  }

  /** Log Off */
  logoff(): void {
    this.isAuthenticatedChange.next(false);
    this._alertService.openSnackBar("Logoff Successful");
  }

  /** Incomplete */
  /** Https request to gets company info from server */
  getCompanyInfo(): Observable<CompanyInfo> {
    const options = {
      params: {
        Company: COMPANYNAME,
      }
    };
    return this.http.get<CompanyInfo>(`${APIROOT}/wp_getinfo.asp`, options)
  }

  /** Returns the DateFormat for date-time */
  getDateFormat(): number {
    return this.companyInfo.dateformat;
  }

  /** Returns the date format display to be used in the pipe of the date */
  dateFormatDisplay(dateformat: number): string {
    let desc = "";
    switch(dateformat) {
      case 0:
        // "mm/dd/yyyy"
        desc = "EEEE, M/d/y";
        break;
      case 1:
        // "mm/dd/yy"
        desc = "EEEE, M/d/yy";
          break;
      case 2:
        // "dd/mm/yyyy"
        desc = "EEEE, d/M/y";
        break;
      case 3:
        // "dd/mm/yy"
        desc = "EEEE, d/M/yy";
        break;
      case 4:
        // "yyyy/mm/dd"
        desc = "EEEE, y/M/d";
        break;
      case 5:
        // "yy/mm/dd"
        desc = "EEEE, yy/M/d";
        break;
      default: desc = "?";
    }
    return desc;
  }

  /** Returns the TimeFormat for date-time*/
  getTimeFormat(): number {
    return this.companyInfo.timeformat;
  }

  /** Returns the wkstart */
  getWkStart(): number {
    return this.companyInfo.wkstart;
  }

  /** Returns level 1 label */
  getLevel1Label(): string {
    return this.companyInfo.lvl1label;
  }

  /** Returns level 2 label */
  getLevel2Label(): string {
    return this.companyInfo.lvl2label;
  }

  /** Returns level 3 label */
  getLevel3Label(): string {
    return this.companyInfo.lvl3label;
  }

  /** Https request to get punch configuration from server */
  getPunchConfiguration(): Observable<PunchConfig> {
    const options = {
      params: {
        Company: COMPANYNAME,
      }
    };
    return this.http.get<PunchConfig>(`${APIROOT}/wp_getpunchcfg.asp`, options);
  }

  /** Return current Login Type */
  getLoginType(): number {
    return this.punchConfiguration.logintype;
  }

  /** Returns current Clock Type */
  getClockType(): number {
    return this.punchConfiguration.clocktype;
  }

  /** Return FunctionKey Info */
  getFunctionKeyInfo(functionKeyNumber: number): FunctionKey {
    switch(functionKeyNumber) {
      case 1:
        return this.punchConfiguration.fk1;
      case 2:
        return this.punchConfiguration.fk2;
      case 3:
        return this.punchConfiguration.fk3;
      case 4:
        return this.punchConfiguration.fk4;
      case 5:
        return this.punchConfiguration.fk5;
      case 6:
        return this.punchConfiguration.fk6;
      default:
        return this.punchConfiguration.fk1;
    }
  }

  /** Get current date and time for employee */
  getEmpDateTime(): Observable<DateTimeStatus> {
    const options = {
      params: {
        Company: COMPANYNAME,
        EmpID:this.employeeStatus.empid,
      }
    };
    return this.http.get<DateTimeStatus>(`${APIROOT}/wp_getempdatetime.asp`, options);
  }

  /** Https request to get list of level 1 codes */
  getLevel1Codes(): Observable<CodeList> {
    const options = {
      params: {
        Company: COMPANYNAME,
        order:1,
        startloc:1,
        listsize:100
      }
    };
    return this.http.get<CodeList>(`${APIROOT}/wp_GetL1List.asp`, options);
  }

  /** Https request to get list of level 1 codes */
  getLevel2Codes(): Observable<CodeList> {
    const options = {
      params: {
        Company: COMPANYNAME,
        order:1,
        startloc:1,
        listsize:100
      }
    };
    return this.http.get<CodeList>(`${APIROOT}/wp_GetL2List.asp`, options);
  }

  /** Https request to get list of level 1 codes */
  getLevel3Codes(): Observable<CodeList> {
    const options = {
      params: {
        Company: COMPANYNAME,
        order:1,
        startloc:1,
        listsize:100
      }
    };
    return this.http.get<CodeList>(`${APIROOT}/wp_GetL3List.asp`, options);
  }

  /** Check if L1 code exists */
  checkL1CodeExists(code:number): Observable<CodeStatus> {
    const options = {
      params: {
        Company: COMPANYNAME,
        l1code:code,
      }
    };
    return this.http.get<CodeStatus>(`${APIROOT}/wp_chkL1.asp`, options);
  }

  /** Check if L2 code exists */
  checkL2CodeExists(code:number): Observable<CodeStatus> {
    const options = {
      params: {
        Company: COMPANYNAME,
        l2code:code,
      }
    };
    return this.http.get<CodeStatus>(`${APIROOT}/wp_chkL2.asp`, options);
  }

  /** Check if L3 code exists
   * INCOMPLETE
  */
  checkL3CodeExists(code:number): Observable<L3CodeStatus> {
    const options = {
      params: {
        Company: COMPANYNAME,
        empid: this.employeeStatus.empid,
        l3code:code,
      }
    };
    return this.http.get<L3CodeStatus>(`${APIROOT}/wp_chkL3.asp`, options);
  }

  /** Invalid level change */
  invalidLevel(): void {
    this._alertService.openSnackBar("Invalid Level Change!");
  }

  /** Https request to get list of pay codes */
  getPayCodes(fktype: number): Observable<CodeList> {
    switch(fktype) {
      /** "HNC" - Hourly non-calculated (employee enters hour value) */
      case 16: {
        const options = {
          params: {
            Company: COMPANYNAME,
            pctype: "HNC",
            order:1,
            startloc:1,
            listsize:100
          }
        };
        return this.http.get<CodeList>(`${APIROOT}/wp_GetPcList.asp`, options);
      }
      /** "ED" - Earning/Deduction code (employee enters dollar amount) */
      case 17: {
        const options = {
          params: {
            Company: COMPANYNAME,
            pctype: "ED",
            order:1,
            startloc:1,
            listsize:100
          }
        };
        return this.http.get<CodeList>(`${APIROOT}/wp_GetPcList.asp`, options);
      }
      /** "HC" - Hourly Calculated (excluding pacyode 0) */
      case 20: {
        const options = {
          params: {
            Company: COMPANYNAME,
            pctype: "HC",
            order:1,
            startloc:1,
            listsize:100
          }
        };
        return this.http.get<CodeList>(`${APIROOT}/wp_GetPcList.asp`, options);
      }
      default: {
        console.log("switch default");
        return this.http.get<CodeList>(`${APIROOT}/wp_GetPcList.asp?Company=COMPANYNAME&pctype=HNC&order=1&startloc=1&listsize=100`);
      }
    }
  }

  /** Get formatted padded current date */
  getCurrentDate(): string {
    let currentDateTime = new Date();
    let year = currentDateTime.getFullYear().toString();
    let month = currentDateTime.getMonth().toString();
    let day = currentDateTime.getDay().toString();

    // Pad month and day if not double digit month
    if(month.length<2) {
      month = "0" + month;
    }
    if(day.length<2) {
      day = "0" + day;
    }

    return year + "-" + month + "-" + day;
  }

  /** Get formatted padded current time */
  getCurrentTime(): string {
    let currentDateTime = new Date();
    let hour = currentDateTime.getHours().toString();
    let minute = currentDateTime.getMinutes().toString();
    let second = currentDateTime.getSeconds().toString();

    // Pad hour/min/sec if not double digit month
    if(hour.length<2) {
      hour = "0" + hour
    }
    if(minute.length<2) {
      minute = "0" + minute;
    }
    if(second.length<2) {
      second = "0" + second;
    }

    return hour + ":" + minute + ":" + second;
  }

  /** Valid level change */
  postPunch(form: any) {
    console.log(form);

    let options = {
      params: {
        Company: COMPANYNAME,
        punchdata: JSON.stringify({
          "empid": this.employeeStatus.empid,
          "cardnum": this.employeeStatus.cardnum,
          "punchcode": form["punchcode"],
          "date": this.getCurrentDate(),
          "time": this.getCurrentTime(),
          "l1": form["l1"] || 0,
          "l2": form["l2"] || 0,
          "l3": form["l3"] || 0,
          "pc": form["pc"] || 0,
          "hour": form["hour"] || 0,
          "amount": form["amount"] || 0,
          "accflag": 0,
          "account": 0,
          "rejflag": 0,
          "rejcount": 0
        })
      }
    }
    console.log(`${APIROOT}/wp_PostPunch.asp`, options);
    this.http.get(`${APIROOT}/wp_PostPunch.asp`, options).subscribe(
      response => {
        console.log('Response from server:', response);
      },
      error => {
        console.error('Error sending data:', error);
      }
    );
    this._alertService.openSnackBar("Punch Recorded!");
  }

  /** Https request to get last punch from server */
  getLastPunch(): Observable<LastPunch> {
    const options = {
      params: {
        Company: COMPANYNAME,
        EmpID: this.employeeStatus.empid
      }
    };
    return this.http.get<LastPunch>(`${APIROOT}/wp_ViewLastPunch.asp`, options);
  }

  getTotalHours(): Observable<TotalHours> {
    const options = {
      params: {
        Company: COMPANYNAME,
        EmpID: this.employeeStatus.empid
      }
    };
    return this.http.get<TotalHours>(`${APIROOT}/wp_ViewTotalHour.asp`, options);
  }

}
