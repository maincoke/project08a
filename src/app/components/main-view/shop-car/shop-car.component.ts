import { Component, OnInit, Renderer2 } from '@angular/core';
import { TopbarComponent } from '../topbar/topbar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { GetSidService } from '../../../services/get-sid.service';
import { DataService } from '../../../services/data-service.service';
import { ShopCarService } from '../../../services/shop-car.service';
import { Product } from '../../../data-model/product';
import { ShopCar } from '../../../data-model/shop-car';

export interface ProdsCar { id: string; name: string; img: string; price: number; quantt: number; subcheck: number; }

@Component({
  selector: 'app-shop-car',
  templateUrl: './shop-car.component.html',
  styleUrls: ['./shop-car.component.css']
})
export class ShopCarComponent implements OnInit {
  public shopcarProds: ShopCar = new ShopCar();
  public listProds: Product[];
  public listProdsCar: ProdsCar[] = new Array;
  public totalCar: number;
  public totalChk: string;
  constructor(private userSid: GetSidService, public shopCarSrv: ShopCarService, public dataService: DataService,
              private renderizer: Renderer2, private barNotice: MatSnackBar, private shopRouter: Router,
              private shopCarIcon: TopbarComponent) { }

  ngOnInit() {
    console.clear();
    this.loadingShopcar();
  }

  loadingShopcar() {
    const sid: string = this.userSid.sendSid();
    if (sid === null) {
      this.userSid.clearSid();
      this.shopRouter.navigate([ 'salir' ]);
    }
    this.shopCarSrv.getShopCarData(sid);
    if (!this.shopCarSrv.error && sid) {
      this.shopcarProds = this.shopCarSrv.shopCar;
      this.shopCarIcon.setIconBadge();
      const dataProds = this.dataService.getProducts(sid);
      dataProds.then(resp => {
        this.listProds = resp.body;
      }).catch(err => {
        console.error(err);
      }).finally(() => {
        this.bindingDataCarProds();
      });
    } else {
      console.log(this.shopCarSrv.error);
      if (this.shopCarSrv.msgerr) {
        this.barNotice.open(this.shopCarSrv.msgerr, '', { duration: 4000, panelClass: 'notice-bar-error' });
        this.userSid.clearSid();
        this.shopRouter.navigate([ 'salir' ]);
      }
    }
  }

  bindingDataCarProds() {
    this.listProdsCar = new Array;
    this.totalCar = 0;
    this.shopcarProds.products.forEach((prodcar: {id: string; price: number; quantt: number}, pidx: number) => {
      const findIt = this.shopcarProds.findProduct(prodcar.id);
      this.listProds.forEach((prod: Product) => {
        if (prodcar.id === prod._id && findIt >= 0) {
          this.listProdsCar.push({ id: prodcar.id, name: prod.name, img: prod.image, price: prodcar.price,
                              quantt: prodcar.quantt, subcheck: prodcar.price * prodcar.quantt });
          this.totalChk = this.shopCarSrv.showTotalItem(this.totalCar += this.listProdsCar[pidx].subcheck);
        }
      });
    });
  }

  purchaseShopCar() {
    const sid = this.userSid.sendSid();
    const shopCarOrder = this.shopCarSrv.shopCar.order;
    const buyIt = this.barNotice.open('Está usted seguro de realizar la compra de los productos de este carriro?', 'Comprar',
                                      { panelClass: 'notice-bar-success'});
    // confirm('Está usted seguro de realizar la compra de los productos de este carriro?');
    if (buyIt) {
      this.dataService.purchaseCar(sid, shopCarOrder).then(res => {
        if (!res.body.msgerr) {
          this.barNotice.open(res.body.msgscs, '', { duration: 1500, panelClass: 'notice-bar-success'});
        } else {
          this.barNotice.open(res.body.msgerr, '', { duration: 1500, panelClass: 'notice-bar-error'});
        }
      }).catch(err => {
        console.error(err);
      });
    }
  }

  removeProdCar(idxProd: any, prodId: any, qtProd: any) {
    const parentList = this.renderizer.parentNode(document.getElementById(idxProd));
    const sid: string = this.userSid.sendSid();
    this.renderizer.removeChild(parentList, document.getElementById(idxProd));
    this.totalChk = this.shopCarSrv.showTotalItem(this.totalCar -= this.listProdsCar[idxProd].subcheck);
    this.listProdsCar.splice(idxProd, 1);
    this.shopCarSrv.popProductFromCar(sid, prodId, qtProd);
    this.shopCarIcon.setBadgeOnDeduct(this.listProdsCar.length);
  }

}

