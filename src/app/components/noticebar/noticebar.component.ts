import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-noticebar',
  templateUrl: './noticebar.component.html',
  styleUrls: ['./noticebar.component.css']
})
export class NoticebarComponent {
  public durationSecs = 4;
  public msg: string;
  public btnTitle: string;
  constructor(private noticeBar: MatSnackBar) { }

  openSnackBarNotice(msg: string, btnTitle: string) {
    this.noticeBar.open(this.msg, this.btnTitle, {
      duration: this.durationSecs * 1000
    });
  }

}
