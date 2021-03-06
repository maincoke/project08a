/** Componente de código Typescript para cargar los productos del Carrito de Compras de la Tienda Online */
import { Component, OnInit, Renderer2 } from '@angular/core';
import { TopbarComponent } from '../topbar/topbar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { GetSidService } from '../../../services/get-sid.service';
import { DataService } from '../../../services/data-service.service';
import { ShopCarService } from '../../../services/shop-car.service';
import { Product } from '../../../data-model/product';
import { ShopCar } from '../../../data-model/shop-car';

// Modelo Interface: Productos del Carrito de Compras./
export interface ProdsCar { id: string; name: string; img: string; price: number; quantt: number; subcheck: number; }

@Component({
  selector: 'app-shop-car',
  templateUrl: './shop-car.component.html',
  styleUrls: ['./shop-car.component.css']
})
export class ShopCarComponent implements OnInit { // Clase del Componente del Carrito de Compras de la Tienda Online./
  public shopcarProds: ShopCar = new ShopCar();
  public listProds: Product[];
  public listProdsCar: ProdsCar[] = new Array;
  public totalCar: number;
  public totalChk: string;
  constructor(private userSid: GetSidService, public shopCarSrv: ShopCarService, public dataService: DataService,
              private renderizer: Renderer2, private barNotice: MatSnackBar, private shopRouter: Router,
              private shopCarIcon: TopbarComponent) { }

  ngOnInit() { // Método: Se ejecuta para cargar los datos de productos del Carrito de Compras./
    this.loadingShopcar();
  }

  loadingShopcar() { // Evento: Ejecuta la verificación y comprobación de los datos de productos del Carrito de Compras./
    const sid: string = this.userSid.sendSid();
    this.shopCarSrv.getShopCarData(sid);
    if (!this.shopCarSrv.error && sid) {
      this.shopcarProds = this.shopCarSrv.shopCar;
      this.shopCarIcon.setIconBadge();
      const dataProds = this.dataService.getProducts(sid);
      dataProds.then(resp => {
        if (resp.body.msgerr) { throw resp.error; }
        this.listProds = resp.body;
      }).catch(err => {
        console.error(err);
        if (sid != null) { this.userSid.clearSid(); }
        this.shopRouter.navigate([ 'salir' ]);
      }).finally(() => {
        this.bindingDataCarProds();
      });
    } else {
      this.barNotice.open(this.shopCarSrv.msgerr, '', { duration: 4000, panelClass: 'notice-bar-error' });
      this.userSid.clearSid();
      this.shopRouter.navigate([ 'salir' ]);
    }
  }

  bindingDataCarProds() { // Método: Realiza la relación de los datos entre los productos del Catálogo y los del Carrito de Compras./
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

  purchaseShopCar() { // Evento: Ejecuta la confirmación de Compra de los productos del Carrito de Compras./
    const sid = this.userSid.sendSid();
    const parentList = this.renderizer.parentNode(document.getElementById('0'));
    const shopCarOrder = this.shopCarSrv.shopCar.order;
    const buyIt = this.barNotice.open('Está usted seguro de realizar la compra de los productos de este carriro?', 'Comprar',
                  { panelClass: 'notice-bar-check', duration: 5000 }).onAction();
    buyIt.subscribe(() => {
      this.dataService.purchaseCar(sid, shopCarOrder).then(res => {
        if (!res.body.msgerr) {
          parentList.innerHTML = '';
          this.listProdsCar = new Array;
          this.shopCarIcon.setIconBadge();
          this.barNotice.open(res.body.msgscs, '', { duration: 2000, panelClass: 'notice-bar-success'});
          this.shopRouter.navigate([ '../catalogo' ]);
        } else {
          this.barNotice.open(res.body.msgerr, '', { duration: 1500, panelClass: 'notice-bar-error'});
        }
      }).catch(err => {
        console.error(err);
      });
    });
  }

  removeProdCar(idxProd: any, prodId: any, qtProd: any) { // Evento: Realiza la compra y vaciado de los productos del Carrito de Compras./
    const parentList = this.renderizer.parentNode(document.getElementById(idxProd));
    const sid: string = this.userSid.sendSid();
    this.renderizer.removeChild(parentList, document.getElementById(idxProd));
    this.totalChk = this.shopCarSrv.showTotalItem(this.totalCar -= this.listProdsCar[idxProd].subcheck);
    this.listProdsCar.splice(idxProd, 1);
    this.shopCarSrv.popProductFromCar(sid, prodId, qtProd);
    this.shopCarIcon.setBadgeOnDeduct(this.listProdsCar.length);
  }
}
