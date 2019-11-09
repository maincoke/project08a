import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatListModule } from '@angular/material/list';

import { DataService } from '../../services/data-service.service';
import { ProdSearchPipe } from '../../services/prod-search.pipe';

import { MainViewRoutingModule } from './main-view-routing.module';

import { MainViewComponent } from './main-view.component';
import { TopbarComponent} from './topbar/topbar.component';
import { CatalogComponent } from './catalog/catalog.component';
import { ViewProductComponent } from './view-product/view-product.component';
import { ShopCarComponent } from './shop-car/shop-car.component';
import { PurchasesComponent } from './purchases/purchases.component';

@NgModule({
  declarations: [
    MainViewComponent, TopbarComponent,
    ViewProductComponent, ShopCarComponent,
    PurchasesComponent, CatalogComponent,
    ProdSearchPipe
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    ReactiveFormsModule, FormsModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatButtonToggleModule,
    MatIconModule, MatDialogModule, MatDividerModule,
    MatSnackBarModule, MatToolbarModule, MatCardModule,
    MatBadgeModule, MatListModule, MatTooltipModule,
    MainViewRoutingModule
  ],
  exports: [
    MatFormFieldModule, MatInputModule, MatButtonModule, MatButtonToggleModule,
    MatIconModule, MatDividerModule, MatDialogModule, MatSnackBarModule,
    MatToolbarModule, MatCardModule, MatBadgeModule, MatListModule,
    MatTooltipModule
  ],
  providers: [ DataService, TopbarComponent ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class MainViewModule { }
