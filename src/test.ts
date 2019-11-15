/* Este es el archivo que requiere karma.conf.js y carga recursivamente todos
  los archivos .spec y modulos del Framework */

import 'zone.js/dist/zone-testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

declare const require: any;

// Primero, se inicializa el Ambiente de Prueba de Angular.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
// Despues se encuentran todas las pruebas.
const context = require.context('./', true, /\.spec\.ts$/);
// Y luego se cargos los módulos.
context.keys().map(context);
