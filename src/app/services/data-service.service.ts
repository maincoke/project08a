/** Módulo de Servicio TypeScript para Solicitudes REST con el Paquete Progresivo AJAX SuperAgent */
import { Injectable } from '@angular/core';
import * as request from 'superagent';
import { User } from '../data-model/user';
import { Creds } from '../data-model/creds';

@Injectable({
  providedIn: 'root'
})
export class DataService { // Clase de Servicio para las Solicitudes HTTP REST de la Tienda Online./
  private urlSvrData = 'http://' + window.location.hostname + ':3000/shopping';
  constructor() { }

  public checkLogin(credsUser: Creds) { // Método: Ejecuta la solicitud de Verificación de credenciales del Usuario./
    const userCreds = JSON.stringify(credsUser);
    return request.post(this.urlSvrData + '/login').type('application/json').responseType('json').send(userCreds);
  }

  public logoutApp(sidUser: string) { // Método: Ejecuta la solicitud de finalización de sesión del Usuario./
    const sid = JSON.stringify({ sid: sidUser });
    return request.post(this.urlSvrData + '/logout').type('application/json').responseType('json').send(sid);
  }

  public addNewUser(dataUser: User) { // Método: Ejecuta la solicitud de Registro del Usuario en la Tienda Online./
    const userData = JSON.stringify(dataUser);
    return request.post(this.urlSvrData + '/newuser').type('application/json').responseType('json').send(userData);
  }

  public getProducts(sidUser: string) { // Método: Ejecuta la solicitud de datos de los Productos del Catálogo de la Tienda Online./
    const sid = JSON.stringify({ sid: sidUser });
    return request.post(this.urlSvrData + '/catalog').type('application/json').responseType('json').send(sid);
  }

  public getShowProduct(sidUser: string, prodId: string) { // Método: Ejecuta la solicitud de datos de un Producto de la Tienda Online./
    const sid = JSON.stringify({ sid: sidUser });
    return request.post(this.urlSvrData + '/product/' + prodId).type('application/json').responseType('json').send(sid);
  }

  public getShopCarProds(sidUser: string) { // Método: Ejecuta la solicitud de datos de los Productos del Carrito de Compras de la Tienda Online./
    const sid = JSON.stringify({ sid: sidUser });
    return request.post(this.urlSvrData + '/shopcar').type('application/json').responseType('json').send(sid);
  }

  // Método: Ejecuta la solicitud de adición de un Producto al Carrito de Compras de la Tienda Online./
  public addProd2Car(sidUser: string, ordCar: string, newProd: { id: string, price: number, quantt: number }, newStk: number) {
    const dataProd = JSON.stringify({ sid: sidUser, order: ordCar, prod: newProd, newstk: newStk });
    return request.post(this.urlSvrData + '/newprod').type('application/json').responseType('json').send(dataProd);
  }

  // Método: Ejecuta la solicitud de actualización de Precio y cantidad de un Producto en el Carrito de Compras de la Tienda Online./
  public updProdInCar(sidUser: string, ordCar: string, idxProd: number, prodId: string, newPrc: number, newQt: number, newStk: number) {
    const dataProd = JSON.stringify({ sid: sidUser, order: ordCar, idx: idxProd, price: newPrc, quantt: newQt, newstk: newStk });
    return request.post(this.urlSvrData + '/updateprod/' + prodId).type('application/json').responseType('json').send(dataProd);
  }

  // Método: Ejecuta la solicitud de deducción de un Producto en el Carrito de Compras de la Tienda Online./
  public delProdFromCar(sidUser: string, ordCar: string, prodId: string, newStk: number) {
    const dataProd = JSON.stringify({ sid: sidUser, order: ordCar, newstk: newStk });
    return request.post(this.urlSvrData + '/deleteprod/' + prodId).type('application/json').responseType('json').send(dataProd);
  }

  public getPurchases(sidUser: string) { // Método: Ejecuta la solicitud de las Compras Realizadas por el Usuario en la Tienda Online./
    const sid = JSON.stringify({ sid: sidUser });
    return request.post(this.urlSvrData + '/shopping').type('application/json').responseType('json').send(sid);
  }

  public purchaseCar(sidUser: string, ordCar: string) { // Método: Ejecuta la solicitud de Compra los Productos del Carrito en la Tienda Online./
    const sid = JSON.stringify({ sid: sidUser });
    return request.post(this.urlSvrData + '/purchase/' + ordCar).type('application/json').responseType('json').send(sid);
  }
}
