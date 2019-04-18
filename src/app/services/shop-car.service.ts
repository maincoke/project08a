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
  public msgscs: string;
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
        this.shopCar.products = res.body.shopcarProds !== undefined ? res.body.shopcarProds : [{ id: '', price: 0, quantt: 0}];
      }
    }).catch(err => {
      console.error(err);
      this.error = true;
    });
    console.log(this.shopCar);
  }

  pushProduct2Car(sid: string, idProd: string, prcProd: number, qtProd: number) {
    console.log(this.shopCar);
    const order = this.shopCar.order;
    const prodCar = { id: idProd, price: prcProd, quantt: qtProd };
    try {
      const findIt = this.shopCar.findProduct(idProd);
      if (findIt < 0) {
        this.shopCar.addProduct(prodCar);
        this.dataService.addProd2Car(sid, order, prodCar).then(res => {
          if (res.body.msgscs) { this.msgscs = res.body.msgscs; }
          if (res.error) { throw res.error; }
        }).catch(err => {
          console.error(err);
          this.error = false;
        });
      } else {
        this.shopCar.updProduct(findIt, prcProd, qtProd);
        this.dataService.updProdInCar(sid, order, findIt, idProd, prcProd, qtProd).then(res => {
          if (res.body.msgscs) {
            this.msgscs = res.body.msgscs;
            console.log(this.msgscs);
          }
          if (res.error) { throw res.error; }
        }).catch(err => {
          console.error(err);
          this.error = false;
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
}
