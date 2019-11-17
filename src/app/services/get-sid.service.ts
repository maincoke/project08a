/** Módulo de Servicio TypeScript para la Gestión de Sesión de Usuario en la Tienda Online */
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GetSidService { // Clase de Servicio para la Gestión de Sesión de Usuario en la Tienda Online./
  private userSid: string;
  constructor() { }

  sendSid() { // Método: Ejecuta la verificación y envío del Código de Sesión de Usuario./
    this.userSid = sessionStorage.getItem('shopsid') !== null && sessionStorage.getItem('shopsid') !== undefined ?
                  sessionStorage.getItem('shopsid') : null;
    return this.userSid;
  }

  clearSid() { // Método: Ejecuta la supresión del Código de Sesión de Usuario./
    sessionStorage.removeItem('shopsid');
  }
}
