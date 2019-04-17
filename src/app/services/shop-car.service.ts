import { Injectable } from '@angular/core';
import { DataService } from './data-service.service';
import { ShopCar } from '../data-model/shop-car';
// import { GetSidService } from './get-sid.service';

@Injectable({
  providedIn: 'root'
})
export class ShopCarService {
  public userCar: string;
  public error = false;
  public msgerr: string;
  public shopCar: ShopCar = new ShopCar();

  constructor(private dataService: DataService) { }

  getShopCarData(sid: string) {
    this.dataService.getShopCarProds(sid).then(res  => {
      if (res.body.msgerr) {
        // this.error = true;
        this.msgerr = res.body.msgerr;
        console.log(this.msgerr);
        throw res.error;
      } else {
        this.error = false;
        console.log(res.body);
        this.userCar = res.body.username;
        this.shopCar.order = res.body.order;
        this.shopCar.paidod = res.body.paidod;
        this.shopCar.products = res.body.shopCarProds;
      }
    }).catch(err => {
      this.error = true;
    });
  }
}
