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
    const userData = JSON.stringify(dataUser);
    console.log(userData);
    let responseData;
    return responseData = request.post('http://localhost:3000/shopping/newuser').type('application/json').send(userData)
    .responseType('json')
    .end((err, res) => {
      if (err) {
        console.error(err);
      } else {
        console.log(res.body);
        return res.body.msg;
      }
    });
  }
}
