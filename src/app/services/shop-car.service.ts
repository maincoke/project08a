import { Injectable, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
import { DataService } from './data-service.service';
import { GetSidService } from './get-sid.service';
import { ShopCar } from '../data-model/shop-car';


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

  constructor(private dataService: DataService, private userSid: GetSidService, private barNotice: MatSnackBar ) { }

  ngOnInit(): void {
    const sid: string = this.userSid.sendSid();
    this.getShopCarData(sid);
  }

  getShopCarData(sid: string) {
    const dataShocar = this.dataService.getShopCarProds(sid);
    let response: any;
    dataShocar.then(res  => {
      response = res.body;
    }).catch(err => {
      console.error(err);
      this.error = true;
    }).finally(() => {
      if (response.msgerr) {
        this.msgerr = response.msgerr;
        console.log(this.msgerr);
        throw response.error;
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

  pushProduct2Car(sid: string, idProd: string, prcProd: number, qtProd: number, newStk: number) {
    // console.log(this.shopCar);
    const order = this.shopCar.order;
    const prodCar = { id: idProd, price: prcProd, quantt: qtProd };
    try {
      const findIt = this.shopCar.findProduct(idProd);
      if (findIt < 0) {
        this.shopCar.addProduct(prodCar);
        this.dataService.addProd2Car(sid, order, prodCar, newStk).then(res => {
          this.barNotice.open(res.body.msgscs, '', { duration: 1500, panelClass: 'notice-bar-success' });
          if (res.error) { throw res.error; }
        }).catch(err => {
          console.error(err);
        });
      } else {
        const prodUpd = this.shopCar.updProduct(findIt, prcProd);
        const newQt = (prodUpd.newQtt + qtProd);
        console.log('==============================================================');
        console.log(prodUpd);
        console.log(qtProd);
        console.log(newQt);
        this.dataService.updProdInCar(sid, order, findIt, idProd, prcProd, newQt, newStk).then(res => {
          this.barNotice.open(res.body.msgscs, '', { duration: 1500, panelClass: 'notice-bar-success' });
          if (res.error) { throw res.error; }
        }).catch(err => {
          console.error(err);
        });
      }
    } catch (error) {
      console.log(error);
      this.error = true;
    }
  }

}
