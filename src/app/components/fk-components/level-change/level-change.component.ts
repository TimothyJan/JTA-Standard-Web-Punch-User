import { Component, Input, OnInit } from '@angular/core';
import { FunctionKey } from '../../../models/function-key';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { JantekService } from '../../../services/jantek.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CodeDialogComponent } from '../code-dialog/code-dialog.component';

@Component({
  selector: 'app-level-change',
  templateUrl: './level-change.component.html',
  styleUrl: './level-change.component.css'
})

export class LevelChangeComponent implements OnInit{
  @Input() functionKeyNumber: number = 0;

  l1Disabled: boolean = true;
  l2Disabled: boolean = true;
  l3Disabled: boolean = true;

  message1:string = "";
  message2:string = "";
  message3:string = "";

  fk: FunctionKey = {
    "fktype": 1,
    "caption": "",
    "msg1": "",
    "msg2": "",
    "msg3": "",
    "PC": 0
  };

  levelChangeForm = new FormGroup({
    punchcode: new FormControl({value: "", disabled: true}, [Validators.required]),
    l1: new FormControl({value: "", disabled: true}, [Validators.required, Validators.pattern("^[0-9]*$"),]),
    l2: new FormControl({value: "", disabled: true}, [Validators.required, Validators.pattern("^[0-9]*$"),]),
    l3: new FormControl({value: "", disabled: true}, [Validators.required, Validators.pattern("^[0-9]*$"),]),
  });

  constructor(
    private _jantekService: JantekService,
    private _dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.enableL1L2L3();
    this.setMessages();
  }

  /** Enable certain message entries based on fk.fktype */
  enableL1L2L3(): void {
    this.fk = this._jantekService.getFunctionKeyInfo(this.functionKeyNumber);
    switch(this.fk.fktype) {
      case 4: // Swipe-and-go w/ L3 change
        this.disableL1();
        this.disableL2();
        this.enableL3();
        break;
      case 5: // L1 change
        this.enableL1();
        this.disableL2();
        this.disableL3();
        break;
      case 6: // L2 change
        this.disableL1();
        this.enableL2();
        this.disableL3();
        break;
      case 7: // L3 change
        this.disableL1();
        this.disableL2();
        this.enableL3();
        break;
      case 8: // L1, L2 change
        this.enableL1();
        this.enableL2();
        this.disableL3();
        break;
      case 9: // L1, L3 change
        this.enableL1();
        this.disableL2();
        this.enableL3();
        break;
      case 10: // L2, L3 change
        this.disableL1();
        this.enableL2();
        this.enableL3();
        break;
      case 11: // L1, L2, L3 change
        this.enableL1();
        this.enableL2();
        this.enableL3();
        break;
    }
  }

  /** Set labels */
  setMessages(): void {
    switch(this.fk.fktype) {
      case 4: // Swipe-and-go w/ L3 change
        this.message1 = "";
        this.message2 = "";
        this.message3 = this.fk.msg1;
        break;
      case 5: // L1 change
        this.message1 = this.fk.msg1;
        this.message2 = "";
        this.message3 = "";
        break;
      case 6: // L2 change
        this.message1 = "";
        this.message2 = this.fk.msg1;
        this.message3 = "";
        break;
      case 7: // L3 change
        this.message1 = "";
        this.message2 = "";
        this.message3 = this.fk.msg1;
        break;
      case 8: // L1, L2 change
        this.message1 = this.fk.msg1;
        this.message2 = this.fk.msg2;
        this.message3 = "";
        break;
      case 9: // L1, L3 change
        this.message1 = this.fk.msg1;
        this.message2 = "";
        this.message3 = this.fk.msg2;
        break;
      case 10: // L2, L3 change
        this.message1 = "";
        this.message2 = this.fk.msg1;
        this.message3 = this.fk.msg2;
        break;
      case 11: // L1, L2, L3 change
      this.message1 = this.fk.msg1;
      this.message2 = this.fk.msg2;
      this.message3 = this.fk.msg3;
        break;
    }
  }

  /** Enable l1 input and dialog */
  enableL1(): void {
    this.levelChangeForm.controls["l1"].enable();
    this.l1Disabled = false;
  }

  /** Disable l1 input and dialog */
  disableL1():void {
    this.levelChangeForm.controls["l1"].disable();
    this.l1Disabled = true;
  }

  /** Enable l2 input and dialog */
  enableL2(): void {
    this.levelChangeForm.controls["l2"].enable();
    this.l2Disabled = false;
  }

  /** Disable l2 input and dialog */
  disableL2():void {
    this.levelChangeForm.controls["l2"].disable();
    this.l2Disabled = true;
  }

  /** Enable l3 input and dialog */
  enableL3(): void {
    this.levelChangeForm.controls["l3"].enable();
    this.l3Disabled = false;
  }

  /** Disable l3 input and dialog */
  disableL3():void {
    this.levelChangeForm.controls["l3"].disable();
    this.l3Disabled = true;
  }

  /** Opens Code Dialog and passes fktype and current PayCode to dialog component.
   * After selection in dialog, selection is inputted to the formcontrol for msg1.
  */
  openCodeL1Dialog(): void {
    /** Dialog configuration */
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      fktype: this.fk.fktype,
      currentCode: this.levelChangeForm.controls["l1"].value,
      levelChange: 1
    };

    const dialogRef = this._dialog.open(CodeDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => {
        this.levelChangeForm.controls["l1"].setValue(data[0]);
      }
    );
  }

  /** Opens Code Dialog and passes fktype and current PayCode to dialog component.
   * After selection in dialog, selection is inputted to the formcontrol for msg2.
  */
  openCodeL2Dialog(): void {
    /** Dialog configuration */
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      fktype: this.fk.fktype,
      currentCode: this.levelChangeForm.controls["l2"].value,
      levelChange: 2
    };

    const dialogRef = this._dialog.open(CodeDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => {
        this.levelChangeForm.controls["l2"].setValue(data[0]);
      }
    );
  }

  /** Opens Code Dialog and passes fktype and current PayCode to dialog component.
   * After selection in dialog, selection is inputted to the formcontrol for msg3.
  */
  openCodeL3Dialog(): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      fktype: this.fk.fktype,
      currentCode: this.levelChangeForm.controls["l3"].value,
      levelChange: 3
    };

    const dialogRef = this._dialog.open(CodeDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => {
        this.levelChangeForm.controls["l3"].setValue(data[0]);
      }
    );
  }

  /** Checks if L1 code exists */
  async checkL1CodeExists(code:any): Promise<boolean>  {
    return new Promise<boolean>((resolve, reject) => {
      this._jantekService.checkL1CodeExists(+code).subscribe(
        data => {
          if (data["found"] > 0) {
            resolve(true);
          } else {
            resolve(false);
          }
        },
        error => {
          console.error("Error checking L1 code existence:", error);
          reject(error);
        }
      );
    });
  }

  /** Checks if L2 code exists */
  async checkL2CodeExists(code:any): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this._jantekService.checkL2CodeExists(+code).subscribe(
        data => {
          if (data["found"] > 0) {
            resolve(true);
          } else {
            resolve(false);
          }
        },
        error => {
          console.error("Error checking L2 code existence:", error);
          reject(error);
        }
      );
    });
  }

  /** Checks if L3 code exists */
  async checkL3CodeExists(code:any): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this._jantekService.checkL3CodeExists(+code).subscribe(
        data => {
          if (data["found"] > 0) {
            resolve(true);
          } else {
            resolve(false);
          }
        },
        error => {
          console.error("Error checking L3 code existence:", error);
          reject(error);
        }
      );
    });
  }

  /** Sets punchcode on form */
  setPunchCode(): void {
    switch(this.fk.fktype) {
      case 4: // Swipe-and-go w/ L3 change
        this.levelChangeForm.controls.punchcode.setValue("SJ");
        break;
      case 5: // L1 change
        this.levelChangeForm.controls.punchcode.setValue("L1");
        break;
      case 6: // L2 change
        this.levelChangeForm.controls.punchcode.setValue("L2");
        break;
      case 7: // L3 change
        this.levelChangeForm.controls.punchcode.setValue("L3");
        break;
      case 8: // L1, L2 change
        this.levelChangeForm.controls.punchcode.setValue("L12");
        break;
      case 9: // L1, L3 change
        this.levelChangeForm.controls.punchcode.setValue("L13");
        break;
      case 10: // L2, L3 change
        this.levelChangeForm.controls.punchcode.setValue("L23");
        break;
      case 11: // L1, L2, L3 change
        this.levelChangeForm.controls.punchcode.setValue("L123");
        break;
    }
  }

  /** Checks if all level codes are valid to JantekService */
  async onSubmit(): Promise<void> {
    let allLevelCodesExist = false
    if (this.levelChangeForm.valid) {
      switch(this.fk.fktype) {
        case 4: { // Swipe-and-go w/ L3 change INCOMPLETE
          if (await this.checkL3CodeExists(this.levelChangeForm.controls.l1.value)) {
            allLevelCodesExist = true;
          } else {
            allLevelCodesExist = false;
          }
          break;
        }
        case 5: { // L1 change
          if (await this.checkL1CodeExists(this.levelChangeForm.controls.l1.value)) {
            allLevelCodesExist = true;
          } else {
            allLevelCodesExist = false;
          }
          break;
        }
        case 6: { // L2 change
          if (await this.checkL2CodeExists(this.levelChangeForm.controls.l2.value)) {
            allLevelCodesExist = true;
          } else {
            allLevelCodesExist = false;
          }
          break;
        }
        case 7: { // L3 change
          if (await this.checkL3CodeExists(this.levelChangeForm.controls.l3.value)) {
            allLevelCodesExist = true;
          } else {
            allLevelCodesExist = false;
          }
          break;
        }
        case 8: { // L1, L2 change
          if (await this.checkL1CodeExists(this.levelChangeForm.controls.l1.value) && await this.checkL2CodeExists(this.levelChangeForm.controls.l2.value)) {
            allLevelCodesExist = true;
          } else {
            allLevelCodesExist = false;
          }
          break;
        }
        case 9: { // L1, L3 change
          if (await this.checkL1CodeExists(this.levelChangeForm.controls.l1.value) && await this.checkL3CodeExists(this.levelChangeForm.controls.l3.value)) {
            allLevelCodesExist = true;
          } else {
            allLevelCodesExist = false;
          }
          break;
        }
        case 10: { // L2, L3 change
          if (await this.checkL2CodeExists(this.levelChangeForm.controls.l2.value) && await this.checkL3CodeExists(this.levelChangeForm.controls.l3.value)) {
            allLevelCodesExist = true;
          } else {
            allLevelCodesExist = false;
          }
          break;
        }
        case 11: { // L1, L2, L3 change
          if (await this.checkL1CodeExists(this.levelChangeForm.controls.l1.value) && await this.checkL2CodeExists(this.levelChangeForm.controls.l2.value) && await this.checkL3CodeExists(this.levelChangeForm.controls.l3.value)) {
            allLevelCodesExist = true;
          } else {
            allLevelCodesExist = false;
          }
          break;
        }
        default: {
          console.log("Error getting fktype");
        }
      }
    }
    if (allLevelCodesExist) {
      this.setPunchCode();
      this.postPunch();
    } else {
      this._jantekService.invalidLevel();
    }
  }

  /** Submits level change update to JantekService */
  postPunch(): void {
    this._jantekService.postPunch(this.levelChangeForm.value);
  }
}
