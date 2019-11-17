/** Módulo de Servicio TypeScript para el filtrado de busqueda inmediata de Productos en el Catálogo de la Tienda Online */
import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../data-model/product';

@Pipe({
  name: 'prodSearch',
  pure: false
})
export class ProdSearchPipe implements PipeTransform { // Clase del Servicio de filtrado de Productos en el Catálogo./

  // Método: Ejecuta el filtrado de productos por expresión digitada en el elemento de Busqueda del Catálogo./
  transform(products: Array<Product>, prodFilter: Product): any {
    if (!products || !prodFilter) {
      return products;
    }
    return products.filter(prod => prod.name.indexOf(prodFilter.name) !== -1);
  }

}
