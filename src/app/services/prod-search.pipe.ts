import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../data-model/product';

@Pipe({
  name: 'prodSearch',
  pure: false
})
export class ProdSearchPipe implements PipeTransform {

  transform(products: Array<Product>, prodFilter: Product): any {
    if (!products || !prodFilter) {
      return products;
    }
    return products.filter(prod => prod.name.indexOf(prodFilter.name) !== -1);
  }

}
