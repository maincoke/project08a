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
  constructor(private userSid: GetSidService, public shopCarData: ShopCarService, public dataService: DataService,
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
    this.shopCarData.getShopCarData(sid);
    if (!this.shopCarData.error && sid) {
      this.shopcarProds = this.shopCarData.shopCar;
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
      console.log(this.shopCarData.error);
      if (this.shopCarData.msgerr) {
        this.barNotice.open(this.shopCarData.msgerr, '', { duration: 4000, panelClass: 'notice-bar-error' });
      }
    }
  }

  bindingDataCarProds() {
    this.listProdsCar = new Array;
    this.totalCar = 0;
    const sid = this.userSid.sendSid();
    this.shopcarProds.products.forEach((prodcar: {id: string; price: number; quantt: number}, pidx: number) => {
      const findIt = this.shopcarProds.findProduct(prodcar.id);
      this.listProds.forEach((prod: Product) => {
        if (prodcar.id === prod._id && findIt >= 0) {
          this.listProdsCar.push({ id: prodcar.id, name: prod.name, img: prod.image, price: prodcar.price,
                              quantt: prodcar.quantt, subcheck: prodcar.price * prodcar.quantt });
          this.totalCar = this.totalCar + this.listProdsCar[pidx].subcheck;
        }
      });
    });
  }

  removeProdCar(idxProd: any, prodId: any, qtProd: any) {
    const parentList = this.renderizer.parentNode(document.getElementById(idxProd));
    const sid: string = this.userSid.sendSid();
    this.renderizer.removeChild(parentList, document.getElementById(idxProd));
    this.listProdsCar.splice(idxProd, 1);
    this.shopCarData.popProductFromCar(sid, prodId, qtProd);
    this.shopCarIcon.setIconBadge();
  }

}
