import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MainViewComponent } from './components/main-view/main-view.component';
import { ShopCarComponent } from './components/shop-car/shop-car.component';
import { ViewProductComponent } from './components/view-product/view-product.component';

const routes: Routes = [
  { path: 'inicio', component: LoginComponent },
  { path: 'catalogo', component:  MainViewComponent },
  { path: 'catalogo/carrito', component: ShopCarComponent },
  { path: 'catalogo/producto', component: ViewProductComponent },
  { path: '', redirectTo: 'inicio', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class ShopRoutingModule { }
