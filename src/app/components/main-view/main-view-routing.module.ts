/** Enrutador de 2do. Nivel para los URL's de acceso a los módulos de la Tienda Online */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainViewComponent } from './main-view.component';
import { CatalogComponent } from './catalog/catalog.component';
import { ShopCarComponent } from './shop-car/shop-car.component';
import { PurchasesComponent } from './purchases/purchases.component';
import { ViewProductComponent } from './view-product/view-product.component';

// Rutas de 2do. Nivel./
const childRoutes: Routes = [
    { path: 'bodega', component: MainViewComponent, children: [
      { path: 'catalogo', component: CatalogComponent },
      { path: 'carrito', component: ShopCarComponent },
      { path: 'compras', component: PurchasesComponent },
      { path: 'producto/:id', component: ViewProductComponent }
    ] }
];

@NgModule({ // Módulos del Enrutador de 2do. Nivel./
  imports: [RouterModule.forChild(childRoutes)],
  exports: [RouterModule]
})
export class MainViewRoutingModule { } // Clase del Enrutador de 2do. Nivel de la Tienda Online./
