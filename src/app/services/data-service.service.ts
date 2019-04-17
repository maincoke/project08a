import { Injectable } from '@angular/core';
import * as request from 'superagent';
import { User } from '../data-model/user';
import { Creds } from '../data-model/creds';
// import { ShopCar } from '../data-model/shop-car';
// import { Product } from '../data-model/product';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private urlSvrData = 'http://localhost:3000/shopping';
  constructor() {}

  public checkLogin(credsUser: Creds) {
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
}
