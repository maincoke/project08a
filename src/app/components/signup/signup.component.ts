import { Component, Inject } from '@angular/core';
import { FormControl, Validators, NgForm, FormGroup, FormControlName } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from '../../data-model/user';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
public namesUser = new FormControl('', [ Validators.required, Validators.minLength(8) ]);
public emailUser = new FormControl('', [ Validators.required, Validators.email ]);
public pwordUser = new FormControl('', [ Validators.required, Validators.minLength(8) ]);
public againPwrd = new FormControl('', [ Validators.required, Validators.minLength(8) ]);
public userForm: FormGroup = new FormGroup({
  namesUser: this.namesUser,
  emailUser: this.emailUser,
  againPwrd: this.againPwrd
});
  constructor(public userSignup: MatDialogRef<SignupComponent>,
              @Inject(MAT_DIALOG_DATA) public signupData: User) { }

  sendSignup() {
    console.log('Enviando datos...!');
  }
}
