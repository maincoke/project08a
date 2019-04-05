import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MainViewComponent } from './components/main-view/main-view.component';

const rootRoutes: Routes = [
  { path: 'inicio', component: LoginComponent },
  { path: 'bodega', redirectTo: 'bodega', pathMatch: 'full' },
  { path: 'salir', redirectTo: 'inicio', pathMatch: 'full' },
  { path: '', redirectTo: 'inicio', pathMatch: 'full' }
]; // Colocar ruta no encontrada y de SALIR ---->>>>>

@NgModule({
  imports: [ RouterModule.forRoot(rootRoutes) ],
  exports: [ RouterModule ],
  providers: []
})
export class ShopRoutingModule { }
// , { enableTracing: true }
