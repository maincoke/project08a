/** Clase Global del Carrito de Compras de la Tienda Online */
export class ShopCar {
  public order: string;
  public paidod: boolean;
  public products: [{
    id: string;
    price: number;
    quantt: number;
  }];

  findProduct(idProd: string) { // Método: Realiza la busqueda de un producto en el Carrito de Compras./
    return this.products.findIndex((prod: { id: string, price: number, quantt: number}) => prod.id === idProd);
  }

  addProduct(prod: { id: string, price: number, quantt: number }) { // Método: Agrega un producto en el Carrito de Compras./
    return this.products.push(prod);
  }

  delProduct(idxProd: number) { // Método: Quita un producto del Carrito de Compras./
    return this.products.splice(idxProd, 1);
  }

  updProduct(idxProd: number, newPrc: number) {// Método: Actualiza el precio y cantidad de un producto en el Carrito de Compras./
    const newQtt: number = this.products[idxProd].quantt;
    const priceNew: number = this.products[idxProd].price !== newPrc ? newPrc : this.products[idxProd].price;
    return { priceNew, newQtt };
  }
}
