import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatSnackBarModule } from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { SignupComponent } from './components/signup/signup.component';
import { NoticebarComponent } from './components/noticebar/noticebar.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TopbarComponent,
    SignupComponent,
    NoticebarComponent
  ],
  entryComponents: [
    SignupComponent, NoticebarComponent
   ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule, FormsModule,
    MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule,
    MatDialogModule, MatDividerModule,
    MatSnackBarModule,
    AppRoutingModule
  ],
  exports: [
    MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule,
    MatDividerModule, MatDialogModule,
    MatSnackBarModule
  ],
  providers: [ ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
