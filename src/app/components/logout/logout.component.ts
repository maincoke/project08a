/** Componente de código Typescript que ejecuta el Final de Sesión a la Tienda Online */
import { Component, Renderer2, DoCheck } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../services/data-service.service';
import { GetSidService } from '../../services/get-sid.service';

@Component({
  selector: 'app-logout',
  template: '<p></p>',
  styles: ['']
})
export class LogoutComponent implements DoCheck { // Clase de Componente de Salida de la Tienda Online./

  constructor(private bgRender: Renderer2, private shopRouter: Router,
              private userSid: GetSidService, private dataService: DataService) { }

  ngDoCheck() { // Método: Se ejecuta inmediatamente al llamar le final de sesión y salida de la Tienda Online./
    const sid = this.userSid.sendSid();
    const loggingOut = this.dataService.logoutApp(sid);
    if (sid) {
      loggingOut.then(res => {
        if (res) { this.userSid.clearSid(); }
      }).catch(error => { console.error(error); });
    }
    this.bgRender.removeClass(document.body, 'bckgr-main');
    console.clear();
    this.shopRouter.navigate([ '/inicio' ]);
  }
}
