import { Component, Input, OnInit } from '@angular/core';
import { FunctionKey } from '../../../models/function-key';
import { JantekService } from '../../../services/jantek.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-hour-amount-pc',
  templateUrl: './hour-amount-pc.component.html',
  styleUrl: './hour-amount-pc.component.css'
})
export class HourAmountPcComponent implements OnInit{
  @Input() functionKeyNumber: number = 0;

  fk: FunctionKey = {
    "fktype": 0,
    "caption": "",
    "msg1": "",
    "msg2": "",
    "msg3": "",
    "PC": 0
  };

  payCodeForm = new FormGroup({
    punchcode: new FormControl({value: "", disabled: true}, [Validators.required]),
    hour: new FormControl({value: "", disabled: true}, [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]),
    amount: new FormControl({value: "", disabled: true}, [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]),
    pc: new FormControl(0, [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]),
  });

  constructor(
    private _jantekService: JantekService
  ) {}

  ngOnInit(): void {
    this.fk = this._jantekService.getFunctionKeyInfo(this.functionKeyNumber);
    switch(this.fk.fktype) {
      case 16: // Hour Entry
        this.enableHour();
        this.disableAmount();
        break;
      case 17: //Amount Entry
        this.enableAmount();
        this.disableHour();
        break;
      default:
        console.log("Error reading FK type");
        break;
    }
  }

  /** Enable Msg 1 input for hour */
  enableHour(): void {
    this.payCodeForm.controls["hour"].enable();
  }

  /** Disable Msg 1 input for hour */
  disableHour():void {
    this.payCodeForm.controls["hour"].disable();
  }

  /** Enable Msg 1 input for amount */
  enableAmount(): void {
    this.payCodeForm.controls["amount"].enable();
  }

  /** Disable Msg 1 input for amount */
  disableAmount():void {
    this.payCodeForm.controls["amount"].disable();
  }

  /** Set Pay Code on form */
  setPayCode(): void {
    this.payCodeForm.controls["pc"].setValue(this.fk.PC);
  }

  /** Submits pay code update to JantekService */
  onSubmit(): void {
    if (this.payCodeForm.valid) {
      this.setPayCode();
      this._jantekService.postPunch(this.payCodeForm.value);
    }
  }
}
