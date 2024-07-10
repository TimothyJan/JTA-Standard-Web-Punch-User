import { Component, Input, OnInit } from '@angular/core';
import { JantekService } from '../../../services/jantek.service';
import { FunctionKey } from '../../../models/function-key';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-break-lunch',
  templateUrl: './break-lunch.component.html',
  styleUrl: './break-lunch.component.css'
})
export class BreakLunchComponent implements OnInit{
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
    punchcode: new FormControl({value: "", disabled: false}, [Validators.required]),
  });

  constructor(
    private _jantekService: JantekService
  ) {}

  ngOnInit(): void {
    this.selectFKType();
  }

  /** Select fk type */
  selectFKType(): void {
    this.fk = this._jantekService.getFunctionKeyInfo(this.functionKeyNumber);
    switch(this.fk.fktype) {
      case 12: // Break Start
        this.payCodeForm.controls["punchcode"].setValue("BS");
        break;
      case 13: // Break End
        this.payCodeForm.controls["punchcode"].setValue("BE");
        break;
      case 14: // Lunch Start
        this.payCodeForm.controls["punchcode"].setValue("LS");
        break;
      case 15: // Lunch End
        this.payCodeForm.controls["punchcode"].setValue("LE");
        break;
      default:
        console.log("Error reading FK type");
        break;
    }
  }

    /** Submits pay code update to JantekService */
    onSubmit(): void {
      if (this.payCodeForm.valid) {
        this._jantekService.postPunch(this.payCodeForm.value);
      }
    }
}
