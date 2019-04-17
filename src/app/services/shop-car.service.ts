import { Injectable } from '@angular/core';
import { DataService } from './data-service.service';
import { ShopCar } from '../data-model/shop-car';

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
        this.msgerr = res.body.msgerr;
        console.log(this.msgerr);
        throw res.error;
      } else {
        this.error = false;
        console.log(res.body);
        this.userCar = res.body.username;
        this.shopCar.order = res.body.order;
        this.shopCar.paidod = res.body.paidod;
        if (res.body.shopCarProds === undefined) {
          console.log('Array vacio---->>');
          this.shopCar.products = [{ id: '', price: 0, quantt: 0 }];
        } else {
          this.shopCar.products = res.body.shopCarProds;
        }
        console.log(this.shopCar);
      }
    }).catch(err => {
      console.error(err);
      this.error = true;
    });
  }

  pushProduct2Car(idProd: string, prcProd: number, qtProd: number) {
    console.log(this.shopCar);
    const prodCar = { id: idProd, price: prcProd, quantt: qtProd };
    try {
      const findIt = this.shopCar.findProduct(idProd);
      if (findIt < 0 || this.shopCar.products === undefined) {
        this.shopCar.addProduct(prodCar);
      } else {
        this.shopCar.updProduct(idProd, prcProd, qtProd);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
