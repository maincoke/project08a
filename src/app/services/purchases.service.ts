import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DataService } from './data-service.service';
import { GetSidService } from './get-sid.service';
import { ShopCarService } from './shop-car.service';
import { ProdsCar} from '../components/main-view/shop-car/shop-car.component';
import { ShopCar } from '../data-model/shop-car';
import { Product } from '../data-model/product';

export class ShopcarNode { fullname: string; nameuser: string; numcar: number; products: ProdsCar[]; totalCar: number; }
export class PurchaseNode { nodename: string; nodenested?: PurchaseNode[]; }

@Injectable({
  providedIn: 'root'
})
export class PurchasesService {
  private dataPurchase: ShopCar[];
  public purchasesNew: BehaviorSubject<PurchaseNode[]> = new BehaviorSubject<PurchaseNode[]>([]);
  public purchaseData: PurchaseNode[];

  constructor(private dataService: DataService, private userSid: GetSidService, private shopCarSrv: ShopCarService) {
    this.initService();
  }

  initService() {
    const sid = this.userSid.sendSid();
    let products: []; let uname: string; let umail: string;
    this.dataService.getPurchases(sid).then(res => {
      if (!res.body.msgerr) {
        uname = res.body.fullname;
        umail = res.body.username;
        this.dataPurchase = res.body.shopCars;
        return this.dataService.getProducts(sid).then(resp => {
          products = resp.body;
          const nodespurchase = this.buildShopcarsData(this.dataPurchase, products, { usern: uname, userm: umail });
          this.purchaseData = (this.buildPurchasesTree(nodespurchase, 0));
          this.purchasesNew.next(this.purchaseData);
        }).catch(error => { console.error('Error en la respuesta Productos: -->' + error); });
      } else { console.error(res.body.msgerr); }
    }).catch(err => { console.error('Error en la respuesta Compras: -->' + err); });
  }

  sendPurchases(): PurchaseNode[] { return this.purchaseData; }

  buildShopcarsData(dataCars: ShopCar[], dataProds: Product[], dataUser: { usern: string, userm: string}): ShopcarNode[] {
    const nodesShopcar = new Array<ShopcarNode>(); const carProds = new Array<ProdsCar>();
    dataCars.forEach((shopcar: ShopCar, sidx: number) => {
      let carCheck = 0; const carNum = sidx + 1;
      shopcar.products.forEach((prodcar: {id: string; price: number; quantt: number}, pidx) => {
        dataProds.forEach((prod: Product) => {
          if (prodcar.id === prod._id) {
            const prodPurchase: ProdsCar = { id: prodcar.id, name: prod.name, img: prod.image, price: prodcar.price,
                                             quantt: prodcar.quantt, subcheck: prodcar.quantt * prodcar.price };
            carProds.push(prodPurchase);
            carCheck += prodPurchase.subcheck;
          }
        });
      });
      nodesShopcar.push({ fullname: dataUser.usern, nameuser: dataUser.userm, numcar: carNum, products: carProds, totalCar: carCheck });
    });
    return nodesShopcar;
  }

  buildPurchasesTree(object: ShopcarNode[], level: number): PurchaseNode[] {
    return object.map<PurchaseNode>((shopcar) => {
      const node1 = new PurchaseNode();
      node1.nodename = shopcar.numcar.toString();
      if (shopcar.products !== undefined) {
        node1.nodenested = shopcar.products.map<PurchaseNode>((prod) => {
          const node2 = new PurchaseNode();
          node2.nodename = prod.name;
          node2.nodenested = [prod.img, prod.price.toString(), prod.quantt.toString(), prod.subcheck.toString()].map<PurchaseNode>((prop) => {
            const node3 = new PurchaseNode();
            node3.nodename = prop;
            return node3;
          }, []);
          return node2;
        }, []);
      }
      return node1;
    }, []);
  }

}
