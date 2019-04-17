export class ShopCar {
  public order: number;
  public paidod: boolean;
  public products: [{
    id: string;
    price: number;
    quantt: number;
  }];

  findProduct(idProd: string) {
    return this.products.findIndex((prod: { id: string, price: number, quantt: number}) => prod.id === idProd);
  }

  addProduct(prod: { id: string, price: number, quantt: number }) {
    return this.products.push(prod);
  }

  delProduct(idProd: string) {
    const idxProd = this.findProduct(idProd);
    // this.products.findIndex((prod: { id: string, price: number, quantt: number}) => prod.id === idProd);
    return this.products.splice(idxProd, 1);
  }

  updProduct(idProd: string, newPrc: number, newQtt: number) {
    const idxProd = this.findProduct(idProd);
    this.products[idxProd].quantt = this.products[idProd].quantt !== newQtt ? newQtt : this.products[idProd].quantt;
    this.products[idxProd].price = this.products[idProd].price !== newPrc ? newPrc : this.products[idProd].price;
  }
}
