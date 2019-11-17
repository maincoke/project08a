/** Módulo de Servicio TypeScript que gestiona el Carrito de Compras de la Tienda Online */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from './data-service.service';
import { GetSidService } from './get-sid.service';
import { ShopCar } from '../data-model/shop-car';

@Injectable({
  providedIn: 'root'
})
export class ShopCarService { // Clase de Servicio que gestiona el Carrito de Compras./
  public userCar: string;
  public error = false;
  public msgerr: string;
  public msgscs: string;
  public shopCar: ShopCar = new ShopCar();
  public prodsQtt = 0;
  public badgeNum: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public showBadge: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(private dataService: DataService, private userSid: GetSidService, private barNotice: MatSnackBar) {
    this.initService();
    this.badgeNum = new BehaviorSubject<number>(this.prodsQtt);
    this.showBadge = new BehaviorSubject<boolean>(this.prodsQtt > 0 ? false : true);
  }

  initService() { // Método: Se ejecuta para inicializar los datos del Carrito de Compras./
    const sid: string = this.userSid.sendSid();
    this.getShopCarData(sid);
  }

  getShopCarData(sid: string) { // Método: Ejecuta la verificación y obtención de los datos del Carrito de Compras de la Tienda Online./
    let response: any;
    const dataShopcar = this.dataService.getShopCarProds(sid);
    return dataShopcar.then(res  => {
      response = res.body;
    }).catch(err => {
      console.error(err);
      this.error = true;
    }).finally(() => {
      if (response.msgerr) {
        this.error = true;
        this.msgerr = response.msgerr;
        this.failMsg(this.msgerr);
      } else {
        this.error = false;
        this.userCar = response.username;
        this.shopCar.order = response.order;
        this.shopCar.paidod = response.paidod;
        this.shopCar.products = response.shopcarProds !== undefined ? response.shopcarProds : [{ id: '', price: 0, quantt: 0}];
        this.prodsQtt = this.shopCar.products.length;
      }
    });
  }

  // Método: Ejecuta la verificación y adición (o actualización) de un producto en el Carrito de Compras de la Tienda Online./
  pushProduct2Car(sid: string, idProd: string, prcProd: number, qtProd: number, newStk: number) {
    const order = this.shopCar.order;
    const prodCar = { id: idProd, price: prcProd, quantt: qtProd };
    try {
      const findIt = this.shopCar.findProduct(idProd);
      if (findIt < 0) {
        this.shopCar.addProduct(prodCar);
        this.dataService.addProd2Car(sid, order, prodCar, newStk).then(res => {
          this.successMsg(res.body.msgscs, sid);
          if (res.error && res.body.msgerr) { this.msgerr = res.body.msgerr; throw res.error; }
        }).catch(err => {
          this.failMsg(this.msgerr);
          console.error(err);
        });
      } else {
        const prodUpd = this.shopCar.updProduct(findIt, prcProd);
        const newQt = (prodUpd.newQtt + qtProd);
        this.dataService.updProdInCar(sid, order, findIt, idProd, prcProd, newQt, newStk).then(res => {
          this.successMsg(res.body.msgscs, sid);
          if (res.error && res.body.msgerr) { this.msgerr = res.body.msgerr; throw res.error; }
        }).catch(err => {
          this.failMsg(this.msgerr);
          console.error(err);
        });
      }
      return findIt;
    } catch (error) {
      console.log(error);
      this.error = true;
    }
  }

  // Método: Ejecuta la verificación y deducción de un producto en el Carrito de Compras de la Tienda Online./
  popProductFromCar(sid: string, idProd: string, qtProd: number) {
    const order = this.shopCar.order;
    try {
      const findIt = this.shopCar.findProduct(idProd);
      this.shopCar.delProduct(findIt);
      this.dataService.getShowProduct(sid, idProd).then(resp => {
        const currentQt = resp.body.stock;
        const newStock = currentQt + qtProd;
        this.dataService.delProdFromCar(sid, order, idProd, newStock).then(res => {
          if (!res.body.msgerr) {
            this.successMsg(res.body.msgscs, sid);
          } else {
            this.failMsg(res.body.msgerr);
          }
        }).catch(err => {
          console.error(err);
        });
      }).catch(error => {
        console.error(error);
      });
    } catch (error) {
      console.log(error);
      this.error = true;
    }
  }

  successMsg(msg: string, sid: string) { // Evento: Ejecuta una notificación Exitosa y actualiza los productos del Carrito de Compras./
    this.barNotice.open(msg, '', { duration: 1500, panelClass: 'notice-bar-success' });
    this.getShopCarData(sid);
  }

  failMsg(msg: string) { // Evento: Ejecuta una notificación Fallida en la gestión de los productos del Carrito de Compras./
    this.barNotice.open(msg, '', { duration: 1500, panelClass: 'notice-bar-error' });
  }

  // Método: Realiza el formato de visualización de Totales y Subtotales de la Tienda Online./
  showTotalItem(numTotal: number) { return numTotal.toPrecision(this.integersCount(numTotal) + 1); }

  integersCount(num: number) { // Método: Contador de Digitos para los Totales y Subtotales de la Tienda Online./
    let int = 0;
    if (num >= 1) { ++int; }
    while (num / 10 >= 1) { num /= 10; ++int; }
    return int;
  }
}
