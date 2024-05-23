import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { JantekService } from '../../../services/jantek.service';

@Component({
  selector: 'app-punch-screen',
  templateUrl: './punch-screen.component.html',
  styleUrl: './punch-screen.component.css'
})
export class PunchScreenComponent implements OnInit{
  clocktype: string = "";
  currentDateTime:Date = new Date();
  username: string = "";
  punchForm: FormGroup = new FormGroup({
    punchcode: new FormControl("", Validators.required),
  });

  constructor(
    private _jantekService: JantekService
  ){}

  ngOnInit(): void {
    this.setUsername();
    /** Get Punch Configuration to get clocktype*/
    this._jantekService.getPunchConfiguration().subscribe(response => {
      this.clocktype = this.FkClockTypeDesc(response.clocktype);
    });
  }

  /** Set username */
  setUsername(): void {
    this.username = this._jantekService.employeeStatus.firstname + " " + this._jantekService.employeeStatus.lastname;
  }

  /** Returns clock type for the NgSwitch */
  FkClockTypeDesc(clocktype:Number): string {
    var desc = "";
    switch (clocktype) {
      case 1:
        desc = "In and Out";
        break;
      case 2:
        desc = "Swipe and Go";
        break;
      case 3:
        desc = "Swipe and Go (Function Key)";
        break;
      default:
        desc = "?";
    }
    return desc;
  }

  /** Sets PunchCode in Punchform to 'IN' */
  setPunchCodeIn(): void {
    this.punchForm.controls['punchcode'].setValue("IN");
  }

  /** Sets PunchCode in Punchform to 'OUT' */
  setPunchCodeOut(): void {
    this.punchForm.controls['punchcode'].setValue("OUT");
  }

  /** Sets PunchCode in Punchform to 'SJ' which is 'Swipe and Go' */
  setPunchCodeSJ(): void {
    this.punchForm.controls['punchcode'].setValue("SJ");
  }

  /** Post Punch In */
  onPunchIn() {
    this.setPunchCodeIn();
    if (this.punchForm.valid) {
      this._jantekService.postPunch(this.punchForm.value);
    }
  }

  /** Post Punch Out */
  onPunchOut() {
    this.setPunchCodeOut();
    if (this.punchForm.valid) {
      this._jantekService.postPunch(this.punchForm.value);
    }
  }

  /** Post Punch Swipe and Go */
  onPunchSwipeAndGo() {
    this.setPunchCodeSJ
    if (this.punchForm.valid) {
      this._jantekService.postPunch(this.punchForm.value);
    }
  }
}
