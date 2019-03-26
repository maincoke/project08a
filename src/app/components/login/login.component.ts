import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, NgForm, FormGroup, FormControlName } from '@angular/forms';
import { SignupComponent } from '../signup/signup.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Creds } from '../../data-model/creds';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public loginAccount = new FormControl('', [ Validators.required, Validators.email ]);
  public passwAccount = new FormControl('', [ Validators.required, Validators.minLength(8) ]);
  public credsForm: FormGroup = new FormGroup({
    loginAccount: this.loginAccount,
    passwAccount: this.passwAccount
  });
  constructor(public userDialog: MatDialog) { }

  ngOnInit() { }

  submitLogin() {
    const userCreds: Creds = new Creds();
    userCreds.email = this.loginAccount.value;
    userCreds.pword = this.passwAccount.value;
    console.log(userCreds);
    this.loginAccount.reset('');
    this.passwAccount.reset('');
    this.credsForm.controls.loginAccount.setErrors(null);
    this.credsForm.controls.passwAccount.setErrors(null);
  }

  signupUser() {
   const singupDialog = this.userDialog.open(SignupComponent, {
     panelClass: 'signup-dialog',
     width: '40%',
     height: '520px',
     disableClose: false,
     closeOnNavigation: false,
     autoFocus: false,
   });

   singupDialog.afterClosed().subscribe(result => {
     alert('Se cerró la ventana de dialogo!!');
   });
  }
}
