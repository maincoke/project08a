/** Componente de código Typescript para cargar el formulario de Registro de Usuario en la Tienda Online */
import { Component, Inject } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, Validators, NgForm, FormGroup, FormControlName, FormGroupDirective } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from '../../services/data-service.service';
import { User } from '../../data-model/user';

export class PwordMatcher implements ErrorStateMatcher { // Clase de Control para la verificación de contraseñas en Registro de Usuario./
 isErrorState(fieldcontrol: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
   const notvalidCt = !!(fieldcontrol && fieldcontrol.invalid && fieldcontrol.parent.dirty);
   const notvalidPt = !!(fieldcontrol && fieldcontrol.parent && fieldcontrol.parent.invalid && fieldcontrol.parent.dirty);
   return (notvalidCt || notvalidPt);
 }
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent { // Clase del Componente para el Registro de Usuario en la Tienda Online./
  public namesUser = new FormControl('', [ Validators.required, Validators.minLength(8) ]);
  public emailUser = new FormControl('', [ Validators.required, Validators.email ]);
  public pwordUser = new FormControl('', [ Validators.required, Validators.minLength(8) ]);
  public againPwrd = new FormControl('');
  public userForm: FormGroup = new FormGroup({
    namesUser: this.namesUser,
    emailUser: this.emailUser,
    pwordUser: this.pwordUser,
    againPwrd: this.againPwrd
  },  { validators: this.dontMatch });
  public pwordMatcher = new PwordMatcher();

  constructor(private userSignup: MatDialogRef<SignupComponent>, private dataService: DataService,
              @Inject(MAT_DIALOG_DATA) private newSignUser: User, public barNotice: MatSnackBar) {}

  sendSignup() { // Evento: Se ejecuta al hacer click en el botón de Registro de Usuario en el formulario./
    this.newSignUser = new User();
    if (this.userForm.valid) {
      this.newSignUser.namesusr = this.userForm.value.namesUser;
      this.newSignUser.credsusr = { email: this.userForm.value.emailUser, pword: this.userForm.value.againPwrd };
      const addUser = this.dataService.addNewUser(this.newSignUser);
      let response: any; let result: any; let barClass: any;
      addUser.then(res => {
        response = res.body;
      }).catch(err => {
        console.error(err);
      }).finally(()  => {
        result = response.msgscs ? response.msgscs : response.msgerr;
        barClass = response.msgscs ? 'notice-bar-success' : 'notice-bar-error';
        this.barNotice.open(result, '', { duration: 4000, panelClass: barClass });
      });
      this.userSignup.close();
    }
  }

  dontMatch(pwordGroup: FormGroup) { // Método: Ejecuta la validación y comprobación de la contraseña en el Registro de Usuario./
    const pword = pwordGroup.controls.pwordUser.value;
    const again = pwordGroup.controls.againPwrd.value;
    return pword === again ? null : { notEqual: true} ;
  }
}
