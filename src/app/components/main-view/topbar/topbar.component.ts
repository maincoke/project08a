/** Componente de código Typescript para cargar la Barra Supeior-UI de la Tienda Online */
import { Component, OnChanges, OnInit } from '@angular/core';
import { GetSidService } from '../../../services/get-sid.service';
import { ShopCarService } from 'src/app/services/shop-car.service';
import { DataService } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit { // Clase de Componente de la Barra Superior-UI de la Tienda Online./
  public badgeNumb = 0;
  public hideBadge = false;

  constructor(private shopCarSrv: ShopCarService, private userSid: GetSidService, private dataService: DataService) {
    this.shopCarSrv.initService();
    this.shopCarSrv.showBadge.subscribe( badge =>  this.hideBadge = !badge );
    this.shopCarSrv.badgeNum.subscribe( numbdg =>  this.badgeNumb = numbdg );
  }

  ngOnInit(): void { // Método: Realiza la carga de la barra superior (interfaz de usuario). Identificación y menú de la Tienda Online./
    this.setIconBadge();
  }

  setIconBadge() { // Evento: Realiza la verificación y notificación de la cantidad de productos en el ícono del Carrito de Compras./
    const sid: string = this.userSid.sendSid();
    let response: any;
    this.dataService.getShopCarProds(sid).then(res => {
      response = res.body;
    }).catch(err => {
      console.error(err);
    }).finally(() => {
      this.shopCarSrv.badgeNum.next(response.shopcarProds.length > 0 ? response.shopcarProds.length : 0);
      this.shopCarSrv.showBadge.next(response.shopcarProds.length > 0 ? true : false);
    });
  }

  setBadgeOnAdd(numAdd: number) { // Evento: Ejecuta la notificación de adición de un producto en el ícono del Carrito de Compras./
    this.shopCarSrv.badgeNum.next(this.badgeNumb + numAdd);
    this.shopCarSrv.showBadge.next(true);
  }

  setBadgeOnDeduct(numDed: number) { // Evento: Ejecuta la notificación de deducción de un producto en el ícono del Carrito de Compras./
    this.shopCarSrv.badgeNum.next(numDed);
    this.shopCarSrv.showBadge.next(numDed > 0 ? true : false);
  }
}
