/** Especificaciones del Servicio para la Relación de Compras Realizadas en la Tienda Online */
import { TestBed } from '@angular/core/testing';

import { PurchasesService } from './purchases.service';

describe('PurchasesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PurchasesService = TestBed.get(PurchasesService);
    expect(service).toBeTruthy();
  });
});
