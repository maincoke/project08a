import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
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

import { DataService } from '../../services/data-service.service';

import { MainViewRoutingModule } from './main-view-routing.module';

import { MainViewComponent } from './main-view.component';
import { TopbarComponent } from './topbar/topbar.component';
import { CatalogComponent } from './catalog/catalog.component';
import { ViewProductComponent } from './view-product/view-product.component';
import { ShopCarComponent } from './shop-car/shop-car.component';
import { PurchasesComponent } from './purchases/purchases.component';

@NgModule({
  declarations: [
    MainViewComponent, TopbarComponent,
    ViewProductComponent, ShopCarComponent,
    PurchasesComponent, CatalogComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    ReactiveFormsModule, FormsModule,
    MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule,
    MatDialogModule, MatDividerModule,
    MatSnackBarModule, MatToolbarModule,
    MainViewRoutingModule
  ],
  exports: [
    MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule,
    MatDividerModule, MatDialogModule,
    MatSnackBarModule, MatToolbarModule
  ],
  providers: [ DataService ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class MainViewModule { }
