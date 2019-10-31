import { Injectable, OnInit } from '@angular/core';
import { DataService } from './data-service.service';
import { GetSidService } from './get-sid.service';
import { ShopCar } from '../data-model/shop-car';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ShopCarService  implements OnInit {
  public userCar: string;
  public error = false;
  public msgerr: string;
  public msgscs: string;
  public shopCar: ShopCar = new ShopCar();
  public prodsQtt: number;
  public badgeNum: BehaviorSubject<number> = new BehaviorSubject<number>(0) ;
  public showBadge: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(private dataService: DataService, private userSid: GetSidService) {
    // const sid: string = this.userSid.sendSid();
    // this.getShopCarData(sid);

    // ****** Probar en login la data de ShopCar //
  }

  ngOnInit(): void {
  }

  getShopCarData(sid: string) {
    this.dataService.getShopCarProds(sid).then(res  => {
      if (res.body.msgerr) {
        this.msgerr = res.body.msgerr;
        console.log(this.msgerr);
        throw res.error;
      } else {
        this.error = false;
        this.userCar = res.body.username;
        this.shopCar.order = res.body.order;
        this.shopCar.paidod = res.body.paidod;
        this.shopCar.products = res.body.shopcarProds !== undefined ? res.body.shopcarProds : [{ id: '', price: 0, quantt: 0}];
        this.prodsQtt = this.shopCar.products.length;
      }
    }).catch(err => {
      console.error(err);
      this.error = true;
    });
    return { userCar: this.userCar, shopCar: this.shopCar, prodsQtt: this.prodsQtt };
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
        });
      }
    } catch (error) {
      console.log(error);
      this.error = true;
    }
    console.log(this.shopCar.products.length + ' -- ' + this.prodsQtt);
  }

}
