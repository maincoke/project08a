export class ShopCar {
  public order: string;
  public paidod: boolean;
  public products: [{
    id: string;
    price: number;
    quantt: number;
  }];

  findProduct(idProd: string) {
    return this.products.findIndex((prod: { id: string, price: number, quantt: number}) => prod.id === idProd);
  }

  addProduct(prod: { id: string, price: number, quantt: number }) { return this.products.push(prod); }

  delProduct(idxProd: number) { return this.products.splice(idxProd, 1); }

  updProduct(idxProd: number, newPrc: number, newQtt: number) {
    this.products[idxProd].quantt = this.products[idxProd].quantt !== newQtt ? newQtt : this.products[idxProd].quantt;
    this.products[idxProd].price = this.products[idxProd].price !== newPrc ? newPrc : this.products[idxProd].price;
  }
}
