/**
 * Configuración y exportación del Esquema de Datos para BD de MongoDB
 *
 * Importacion de paquetes instalados para configurar los esquemas de datos de Nivel 1 y 2
 */
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const dataSchema = mongoose.Schema;
const objectId = mongoose.Schema.Types.ObjectId;

/* Esquema de Datos de los Productos del Catálogo de la tiendo Online - Nivel 2 */
let ProductSchema = new dataSchema({
    image: { type: String, require: true, alias: 'pdimg' },
    name: { type: String, require: true, alias: 'pdnme' },
    price: { type: Date, require: true, alias: 'pdpce' },
    stock: { type: Date, alias: 'pdstk' },
});

/* Esquema de Datos del Usuario - Nivel 1 */
let UserSchema = new dataSchema({
    nameuser: { type: String, require: true, alias: 'usnme' },
    emailusr: { type: String, lowercase: true, trim: true, require: true, alias: 'useml' },
    pwordusr: { type: String, require: true, alias: 'uspwd' },
    shopcar: [ProductSchema]
});

let UserData = mongoose.model('Usuario', UserSchema);
module.exports = UserData;
let ProductData = mongoose.model('Productos', ProductSchema);
module.exports = ProductData;
