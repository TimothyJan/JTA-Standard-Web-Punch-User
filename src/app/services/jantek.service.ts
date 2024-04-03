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

// const APIROOT = "http://201.12.20.40/timothy_jan/webpunch";
const APIROOT = "http://newdev.jantek.net/webpunch/api";
const COMPANYNAME = "TIMOTHYJANPROJECT";

@Injectable({
  providedIn: 'root'
})
export class JantekService {
  isAuthenticatedChange: Subject<boolean> = new Subject<boolean>();
  companyName:string = "";

  companyInfo: CompanyInfo;
  punchConfiguration: PunchConfig

  /** -DEMO ONLY */

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

  /** Checks if Employee ID exists */
  getEmployeeIDStatus(employeeID: number): Observable<EmployeeStatus> {
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
  logoff() {
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


  /** Returns current Clock Type */
  getClockType(): number {
    return this.punchConfiguration.clocktype;
  }

  /** Returns the DateFormat for date-time */
  getDateFormat() {
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
  getTimeFormat() {
    return this.companyInfo.timeformat;
  }

  /** Returns level 1 label */
  getLevel1Label(): string {
    return this.companyInfo.lvl1label;
  }

  getLevel2Label(): string {
    return this.companyInfo.lvl2label;
  }

  getLevel3Label(): string {
    return this.companyInfo.lvl3label;
  }

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

  /** Valid level change */
  postPunch(form: any) {
    console.log(form);
    this._alertService.openSnackBar("Punch Recorded!");
  }

}
