export class Product {
  public id: string;
  public name: string;
  public image: string;
  public price: number;
  public stock: number;

  /*updProduct(idxProd: string, restQtt: number) {
    this.stock = this.stock - restQtt > 0 ? this.stock - restQtt : 0;
  }*/
}
