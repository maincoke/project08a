import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { ViewProductComponent } from './components/view-product/view-product.component';
import { ShopCarComponent } from './components/shop-car/shop-car.component';
import { PurchasesComponent } from './components/purchases/purchases.component';

const routes: Routes = [
  { path: 'inicio', component: LoginComponent },
  { path: 'catalogo', component:  TopbarComponent },
  { path: 'catalogo/producto', component: ViewProductComponent },
  { path: 'catalogo/carrito', component: ShopCarComponent },
  { path: 'catalogo/compras', component: PurchasesComponent },
  { path: 'salir', redirectTo: 'inicio', pathMatch: 'full' },
  { path: '', redirectTo: 'inicio', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class ShopRoutingModule { }
