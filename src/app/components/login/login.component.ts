/** Componente de código Typescript para cargar el Ingreso con credenciales a la Tienda Online */
import { Component, Renderer2, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';
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
export class LoginComponent implements AfterViewChecked { // Clase del Componente de Ingreso a la Tienda Online./
  public loginAccount = new FormControl('', [ Validators.required, Validators.email ]);
  public passwAccount = new FormControl('', [ Validators.required, Validators.minLength(8) ]);
  public credsForm: FormGroup = new FormGroup({
    loginAccount: this.loginAccount,
    passwAccount: this.passwAccount
  });
  public submitBttn: boolean;

  constructor(private bgRender: Renderer2, public userDialog: MatDialog, private dataService: DataService,
              public barNotice: MatSnackBar, public shopRouter: Router) {
  }

  ngAfterViewChecked() { // Método: Se ejecuta despues de que la vista del componente a sido verificada./
    this.bgRender.addClass(document.body, 'bckgr-login');
  }

  submitLogin() { // Evento: Ejecuta la verificación de las credenciales para ingresar a la Tienda Online./
    if (this.credsForm.valid) {
      const userCreds: Creds = new Creds();
      userCreds.email = this.loginAccount.value;
      userCreds.pword = this.passwAccount.value;
      const loginChk = this.dataService.checkLogin(userCreds);
      let response: any; let result: any; let barClass: any;
      loginChk.then(res => {
        response = res.body;
        sessionStorage.setItem('shopsid', response.sid);
      }).catch(err => {
        console.log(err);
      }).finally(() => {
        if (!response.access) {
          result = response.msg;
          barClass = 'notice-bar-error';
          this.barNotice.open(result, '', { duration: 4000, panelClass: barClass });
        } else {
          barClass = 'notice-bar-success';
          this.barNotice.open('Usuario autenticado!!', '', { duration: 3000, panelClass: barClass });
          this.shopRouter.navigate([ 'bodega/catalogo' ]);
        }
      });
    }
    this.loginAccount.reset('');
    this.passwAccount.reset('');
    this.credsForm.controls.loginAccount.setErrors(null);
    this.credsForm.controls.passwAccount.setErrors(null);
    this.submitBttn = true;
  }

  signupUser() { // Evento: Ejecuta la visualización de la ventana dialogo para el registro de Usuario./
    const singupDialog = this.userDialog.open(SignupComponent, {
      panelClass: 'signup-dialog',
      width: '40%',
      height: '520px',
      disableClose: true,
      closeOnNavigation: false,
      autoFocus: false,
    });
  }

  disablingBtn() { // Evento: Se ejecuta para habilitar/deshabilitar el botón de Ingreso a la Tienda OnLine./
    if (this.loginAccount.valid && this.passwAccount.valid) { this.submitBttn = false; } else { this.submitBttn = true; }
  }
}
