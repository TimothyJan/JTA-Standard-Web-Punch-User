export class Punch {
  "empid": string;
  "cardnum": number;
  "punchcode": string;
  "date": string;
  "time": string;
  "l1": number;
  "l2": number;
  "l3": number;
  "pc": number;
  "hour": number;
  "amount": number;
  "accflag": number;
  "acccount": number;
  "rejflag": number;
  "rejcount": number;
  constructor(
    empid: string,
    cardnum: number,
    punchcode: string,
    date: string,
    time: string,
    l1: number,
    l2: number,
    l3: number,
    pc: number,
    hour: number,
    amount: number,
    accflag: number,
    account: number,
    rejflag: number,
    rejcount: number
  ) {
    this.empid = empid;
    this.cardnum = cardnum;
    this.punchcode = punchcode;
    this.date = date;
    this.time = time;
    this.l1 = l1;
    this.l2 = l2;
    this.l3 = l3;
    this.pc = pc;
    this.hour = hour;
    this.amount = amount;
    this.accflag = accflag;
    this.acccount = account;
    this.rejflag = rejflag;
    this.rejcount = rejcount;
  }
}
