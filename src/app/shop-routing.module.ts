import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';

const rootRoutes: Routes = [
  { path: 'inicio', component: LoginComponent },
  { path: 'bodega', redirectTo: 'bodega', pathMatch: 'full' },
  { path: 'salir', component: LogoutComponent },
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: '**', redirectTo: 'bodega/catalogo' }
];

@NgModule({
  imports: [ RouterModule.forRoot(rootRoutes) ],
  exports: [ RouterModule ],
  providers: []
})
export class ShopRoutingModule { }
