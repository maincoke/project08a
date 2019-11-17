/** Especificaciones del Servicio para el filtrado de busqueda inmediata de Productos en el Catálogo */
import { ProdSearchPipe } from './prod-search.pipe';

describe('ProdSearchPipe', () => {
  it('create an instance', () => {
    const pipe = new ProdSearchPipe();
    expect(pipe).toBeTruthy();
  });
});
