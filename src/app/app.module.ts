import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { DataService } from './services/data-service.service';

import { AppComponent } from './app.component';
import { ShopRoutingModule } from './shop-routing.module';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { MainViewComponent } from './components/main-view/main-view.component';
import { ShopCarComponent } from './components/shop-car/shop-car.component';
import { ViewProductComponent } from './components/view-product/view-product.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    TopbarComponent,
    MainViewComponent,
    ShopCarComponent,
    ViewProductComponent
  ],
  entryComponents: [
    SignupComponent
   ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule, FormsModule,
    MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule,
    MatDialogModule, MatDividerModule,
    MatSnackBarModule, MatToolbarModule,
    ShopRoutingModule
  ],
  exports: [
    MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule,
    MatDividerModule, MatDialogModule,
    MatSnackBarModule, MatToolbarModule
  ],
  providers: [ DataService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
