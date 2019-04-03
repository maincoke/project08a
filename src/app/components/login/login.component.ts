import { Component, Renderer2 } from '@angular/core';
import { FormControl, Validators, NgForm, FormGroup, FormControlName } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { SignupComponent } from '../signup/signup.component';
import { DataService } from '../../services/data-service.service';
import { Creds } from '../../data-model/creds';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  public loginAccount = new FormControl('', [ Validators.required, Validators.email ]);
  public passwAccount = new FormControl('', [ Validators.required, Validators.minLength(8) ]);
  public credsForm: FormGroup = new FormGroup({
    loginAccount: this.loginAccount,
    passwAccount: this.passwAccount
  });
  private dataService: DataService = new DataService();
  public submitBttn = true;

  constructor(private bgRender: Renderer2, public userDialog: MatDialog, public barNotice: MatSnackBar) {
    this.bgRender.addClass(document.body, 'bckgr-login');
  }

  submitLogin() {
    if (this.credsForm.valid) {
      const userCreds: Creds = new Creds();
      userCreds.email = this.loginAccount.value;
      userCreds.pword = this.passwAccount.value;
      const loginChk = this.dataService.checkLogin(userCreds);
      let response: any; let result: any; let barClass: any;
      loginChk.then(res => {
        response = res.body;
      }).catch(err => {
        console.log(err);
      }).finally(() => {
        if (!response.access) {
          result = response.msg;
          barClass = 'notice-bar-error';
          this.barNotice.open(result, '', { duration: 4000, panelClass: barClass });
        } else {
          // Enrutar hacia la pagina de productos y carrito //////// ****** ////// ****** ///////
          barClass = 'notice-bar-success';
          this.barNotice.open('Usuario autenticado!!', '', { duration: 4000, panelClass: barClass });
          console.log(response.id + '  ----  ' + response.username);
          // ------------ ////// --------- //////// --------- //////////////////////////////////
        }
      });
    }
    this.loginAccount.reset('');
    this.passwAccount.reset('');
    this.credsForm.controls.loginAccount.setErrors(null);
    this.credsForm.controls.passwAccount.setErrors(null);
    this.submitBttn = true;
  }

  signupUser() {
    const singupDialog = this.userDialog.open(SignupComponent, {
      panelClass: 'signup-dialog',
      width: '40%',
      height: '520px',
      disableClose: true,
      closeOnNavigation: false,
      autoFocus: false,
    });

    /* singupDialog.afterClosed().subscribe(result => {
      console.log('Se cerró la ventana de dialogo!!');
    });*/
  }

  disablingBtn() {
    if (this.loginAccount.valid && this.passwAccount.valid) { this.submitBttn = false; } else { this.submitBttn = true; }
  }
}
