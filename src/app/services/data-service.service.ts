import { Injectable } from '@angular/core';
import * as request from 'superagent';
import { User } from '../data-model/user';
import { Creds } from '../data-model/creds';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private urlSvrData = 'http://' + window.location.hostname + ':3000/shopping';
  constructor() { }

  public checkLogin(credsUser: Creds) {
    console.log(window.location.hostname);
    const userCreds = JSON.stringify(credsUser);
    return request.post(this.urlSvrData + '/login').type('application/json').responseType('json').send(userCreds);
  }

  public logoutApp(sidUser: string) {
    const sid = JSON.stringify({ sid: sidUser });
    return request.post(this.urlSvrData + '/logout').type('application/json').responseType('json').send(sid);
  }

  public addNewUser(dataUser: User) {
    const userData = JSON.stringify(dataUser);
    return request.post(this.urlSvrData + '/newuser').type('application/json').responseType('json').send(userData);
  }

  public getProducts(sidUser: string) {
    const sid = JSON.stringify({ sid: sidUser });
    return request.post(this.urlSvrData + '/catalog').type('application/json').responseType('json').send(sid);
  }

  public getShowProduct(sidUser: string, prodId: string) {
    const sid = JSON.stringify({ sid: sidUser });
    return request.post(this.urlSvrData + '/product/' + prodId).type('application/json').responseType('json').send(sid);
  }

  public getShopCarProds(sidUser: string) {
    const sid = JSON.stringify({ sid: sidUser });
    return request.post(this.urlSvrData + '/shopcar').type('application/json').responseType('json').send(sid);
  }

  public addProd2Car(sidUser: string, ordCar: string, newProd: { id: string, price: number, quantt: number }, newStk: number) {
    const dataProd = JSON.stringify({ sid: sidUser, order: ordCar, prod: newProd, newstk: newStk });
    return request.post(this.urlSvrData + '/newprod').type('application/json').responseType('json').send(dataProd);
  }

  public updProdInCar(sidUser: string, ordCar: string, idxProd: number, prodId: string, newPrc: number, newQt: number, newStk: number) {
    const dataProd = JSON.stringify({ sid: sidUser, order: ordCar, idx: idxProd, price: newPrc, quantt: newQt, newstk: newStk });
    return request.post(this.urlSvrData + '/updateprod/' + prodId).type('application/json').responseType('json').send(dataProd);
  }

  public delProdFromCar(sidUser: string, ordCar: string, prodId: string, newStk: number) {
    const dataProd = JSON.stringify({ sid: sidUser, order: ordCar, newstk: newStk });
    return request.post(this.urlSvrData + '/deleteprod/' + prodId).type('application/json').responseType('json').send(dataProd);
  }
}
