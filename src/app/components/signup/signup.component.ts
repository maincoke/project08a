import { Component, Inject } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, Validators, NgForm, FormGroup, FormControlName, FormGroupDirective } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material';
import { SuperAgent, SuperAgentStatic } from 'superagent';
import { DataService } from '../../services/data-service.service';
import { User } from '../../data-model/user';

export class PwordMatcher implements ErrorStateMatcher {
 isErrorState(fieldcontrol: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
   const notvalidCt = !!(fieldcontrol && fieldcontrol.invalid && fieldcontrol.parent.dirty);
   const notvalidPt = !!(fieldcontrol && fieldcontrol.parent && fieldcontrol.parent.invalid && fieldcontrol.parent.dirty);
   return (notvalidCt || notvalidPt);
 }
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  public namesUser = new FormControl('', [ Validators.required, Validators.minLength(8) ]);
  public emailUser = new FormControl('', [ Validators.required, Validators.email ]);
  public pwordUser = new FormControl('', [ Validators.required, Validators.minLength(8) ]);
  public againPwrd = new FormControl('');
  public userForm: FormGroup = new FormGroup({
    namesUser: this.namesUser,
    emailUser: this.emailUser,
    pwordUser: this.pwordUser,
    againPwrd: this.againPwrd
  },  {validators: this.dontMatch });
  public pwordMatcher = new PwordMatcher();

  public dataService: DataService = new DataService;

  constructor(private userSignup: MatDialogRef<SignupComponent>,
              @Inject(MAT_DIALOG_DATA) private newSignUser: User,
              private barNotice: MatSnackBar) {}

  sendSignup() {
    this.newSignUser = new User();

    if (this.userForm.valid) {
      this.newSignUser.namesusr = this.userForm.value.namesUser;
      this.newSignUser.credsusr = {
        email: this.userForm.value.emailUser,
        pword: this.userForm.value.againPwrd
      };
      console.log(this.newSignUser);
      this.dataService.addNewUser(this.newSignUser);
      // Agregar usuario con los servicios del HttpClient
      // Refresacar el carrito
      // Ir al Carrito
      const notice = this.barNotice.open('Usuario registrado con éxito!!', '',
       {  duration: 4000,
          panelClass: 'notice-bar-success'
       });
      this.userSignup.close();
    }

    console.log('Enviando datos...!');
  }

  dontMatch(pwordGroup: FormGroup) {
    const pword = pwordGroup.controls.pwordUser.value;
    const again = pwordGroup.controls.againPwrd.value;

    return pword === again ? null : { notEqual: true} ;
  }
}
