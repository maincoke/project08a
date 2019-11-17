/** Especificaciones de Clase Global de los Productos de la Tienda Online */
import { Product } from './product';

describe('Product', () => {
  it('should create an instance', () => {
    expect(new Product()).toBeTruthy();
  });
});
