/** Módulo de Servicio TypeScript para la Relación de Compras Realizadas en la Tienda Online */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DataService } from './data-service.service';
import { GetSidService } from './get-sid.service';
import { ShopCarService } from './shop-car.service';
import { ProdsCar} from '../components/main-view/shop-car/shop-car.component';
import { ShopCar } from '../data-model/shop-car';
import { Product } from '../data-model/product';

// Clase de Objeto que describe las propiedades de las Compras Realizadas en la Tienda Online./
export class ShopcarNode { fullname: string; nameuser: string; numcar: number; products: ProdsCar[]; totalCar: number; }

// Clase de Objeto que se utiliza para representar las Compras Realizadas en la Tienda Online./
export class PurchaseNode { nodename: HTMLElement; nodenested?: PurchaseNode[]; }

@Injectable({
  providedIn: 'root'
})
export class PurchasesService { // Clase del Servicio para gestionar las Compras Realizadas en la Tienda Online./
  public purchasesNew: BehaviorSubject<PurchaseNode[]> = new BehaviorSubject<PurchaseNode[]>([]);
  public purchaseData: PurchaseNode[];

  constructor(private dataService: DataService, private userSid: GetSidService, private shopCarSrv: ShopCarService) { }

  // Método: Ejecuta la relación de datos entre los productos del Catálogo y las Compras realizadas en la Tienda Online./
  buildShopcarsData(dataCars: ShopCar[], dataProds: Product[], dataUser: { usern: string, userm: string}): ShopcarNode[] {
    const nodesShopcar = new Array<ShopcarNode>(); let carProds = new Array<ProdsCar>(); let prodPurchase: ProdsCar;
    dataCars.forEach((shopcar: ShopCar, sidx: number) => {
      let carCheck = 0; const carNum = sidx + 1;
      carProds = new Array<ProdsCar>();
      shopcar.products.forEach((prodcar: {id: string; price: number; quantt: number}, pidx: number) => {
        prodPurchase = {} as ProdsCar;
        dataProds.forEach((prod: Product) => {
          if (prodcar.id === prod._id) {
            prodPurchase = { id: prodcar.id, name: prod.name, img: prod.image, price: prodcar.price,
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

  // Método: Ejecuta la construcción del Listado de las Compras realizadas en la Tienda Online./
  buildPurchasesTree(object: ShopcarNode[]): PurchaseNode[] {
    return object.map<PurchaseNode>((shopcar, idx) => {
      let tagProp: string; let classProp: string[]; let attProp: any; let bgCar: string; let propProd: string;
      const node1 = new PurchaseNode(); const totalChk = this.shopCarSrv.showTotalItem(shopcar.totalCar);
      bgCar = idx % 2 === 0 ? 'bg-info' : 'bg-dark';
      const carsHeader: HTMLElement = this.htmlConverter(null, 'div', ['flex-row', 'mt-2']);
      classProp = ['text-capitalize', 'font-weight-normal', 'text-light', 'p-1', 'float-left', 'rounded', bgCar];
      const carsTitle: HTMLElement = this.htmlConverter('carrito N° ' + shopcar.numcar.toString(), 'h4', classProp);
      classProp = ['text-capitalize', 'font-weight-normal', 'text-muted', 'rounded', 'p-1', 'float-right', 'bg-light', 'mr-header'];
      const totalCheck: HTMLElement = this.htmlConverter('compra total: $ ' + totalChk.toString(), 'h4', classProp);
      carsHeader.appendChild(carsTitle).appendChild(totalCheck);
      node1.nodename = carsHeader;
      if (shopcar.products !== undefined) {
        node1.nodenested = shopcar.products.map<PurchaseNode>((prod) => {
          const node2 = new PurchaseNode();
          classProp = ['text-capitalize', 'font-weight-bold', 'text-light', 'rounded', 'bg-secondary', 'p-1'];
          node2.nodename =  this.htmlConverter(prod.name, 'h5', classProp);
          node2.nodenested = [prod.img, prod.price.toString(), prod.quantt.toString(),
                              this.shopCarSrv.showTotalItem(prod.subcheck).toString()].map<PurchaseNode>((prop, i) => {
            const node3 = new PurchaseNode();
            propProd = i === 0 ? '' : i === 1 ? 'Precio: $ ' + prop : i === 2 ? 'Cantidad: ' + prop : 'Subtotal: $ ' + prop;
            tagProp = i === 0 ? 'img' : 'h6';
            classProp = i === 0 ? [ 'mw-100', 'img-thumbnail' ] : ['font-weight-bold', 'ml-5', 'p-1', 'm-1'];
            attProp = i === 0 ? [['src', prop], ['width', '100vw']] : ['h6'];
            node3.nodename = i !== 0 ? this.htmlConverter(propProd, tagProp, classProp) :
                                       this.htmlConverter(null, tagProp, classProp, attProp);
            return node3;
          }, []);
          return node2;
        }, []);
      }
      return node1;
    }, []);
  }

  // Método: Ejecuta la creación de los elementos HTML para el listado de las Compras Realizadas en la Tienda Online./
  htmlConverter(text: string, typeTag: string, tagClass?: string[], tagAtt?: any): HTMLElement {
    const htmlElem: HTMLElement = document.createElement(typeTag);
    htmlElem.innerHTML = text;
    if (tagAtt) { tagAtt.map((val: string, idx: any, arr: any) => { htmlElem.setAttribute(val[0], val[1]); }); }
    if (tagClass) { tagClass.map(val => { htmlElem.classList.add(val); }); }
    return htmlElem;
  }
}
