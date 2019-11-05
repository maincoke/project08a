import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { GetSidService } from '../../../services/get-sid.service';
import { DataService } from '../../../services/data-service.service';
import { ShopCarService } from '../../../services/shop-car.service';
import { Product } from '../../../data-model/product';
import { ShopCar } from '../../../data-model/shop-car';

export interface ProdsCar {
  name: string;
  img: string;
  price: number;
  quantt: number;
  subcheck: number;
}

@Component({
  selector: 'app-shop-car',
  templateUrl: './shop-car.component.html',
  styleUrls: ['./shop-car.component.css']
})
export class ShopCarComponent implements OnInit {
  public shopcarProds: ShopCar = new ShopCar();
  public listProds: Product[];
  public listProdsCar: ProdsCar[] = new Array;
  constructor(private userSid: GetSidService, public shopCarData: ShopCarService, public dataService: DataService,
              private barNotice: MatSnackBar, private shopRouter: Router) {
  }

  ngOnInit() {
    console.clear();
    this.loadingShopcar();
  }

  loadingShopcar() {
    const sid: string = this.userSid.sendSid();
    this.shopCarData.getShopCarData(sid);
    if (!this.shopCarData.error && sid) {
      this.shopcarProds = this.shopCarData.shopCar;
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
      if (sid != null) { this.userSid.clearSid(); }
      this.shopRouter.navigate([ 'salir' ]);
    }
  }

  bindingDataCarProds() {
    this.listProdsCar = new Array;
    const sid = this.userSid.sendSid();
    this.shopcarProds.products.forEach((prodcar: {id: string; price: number; quantt: number}, pidx: number) => {
      const findIt = this.shopcarProds.findProduct(prodcar.id);
      this.listProds.forEach((prod: Product) => {
        if (prodcar.id === prod._id && findIt >= 0) {
          this.listProdsCar.push({ name: prod.name, img: prod.image, price: prodcar.price,
                              quantt: prodcar.quantt, subcheck: prodcar.price * prodcar.quantt});
        }
      });
    });
  }

}
