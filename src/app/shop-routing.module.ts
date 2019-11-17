/** Enrutador de 1er. Nivel para los URL's de acceso a los módulos de la Tienda Online */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';

// Rutas de 1er. Nivel./
const rootRoutes: Routes = [
  { path: 'inicio', component: LoginComponent },
  { path: 'bodega', redirectTo: 'bodega', pathMatch: 'full' },
  { path: 'salir', component: LogoutComponent },
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: '**', redirectTo: 'bodega/catalogo' }
];

@NgModule({ // Módulos del Enrutador de 1er. Nivel./
  imports: [ RouterModule.forRoot(rootRoutes) ],
  exports: [ RouterModule ],
  providers: []
})
export class ShopRoutingModule { } // Clase del Enrutador de 1er. Nivel de la Tienda Online./
