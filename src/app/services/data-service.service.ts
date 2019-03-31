import { Injectable } from '@angular/core';
import * as request from 'superagent';
// import { SuperAgent, SuperAgentStatic, SuperAgentRequest } from 'superagent';
import { User } from '../data-model/user';
import { ShopCar } from '../data-model/shop-car';
import { Product } from '../data-model/product';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor() { }

  public addNewUser(dataUser: User) {
    request.post('localhost:3000/shopping/newuser').send(dataUser)
    .end((err, res) => {
      if (err) {
        console.error(err);
      } else {
        console.log(res);
      }
    });
  }
}
