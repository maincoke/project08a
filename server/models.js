/**
 * Configuración y exportación del Esquema de Datos para BD de MongoDB
 *
 * Importacion de paquetes instalados para configurar los esquemas de datos de Nivel 1 y 2
 */
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const dataSchema = mongoose.Schema;
const objectId = mongoose.Schema.Types.ObjectId;

/* Esquema de Datos de los Productos del Catálogo de la tienda Online - Nivel 1 */
let ProductSchema = new dataSchema({
  image: { type: String, require: true, alias: 'pdimg' },
  name: { type: String, require: true, alias: 'pdnme' },
  price: { type: Number, require: true, alias: 'pdpce' },
  stock: { type: Number, alias: 'pdstk' },
});

let ProductData = mongoose.model('Productos', ProductSchema);
module.exports = ProductData;
/**
 * ** ///////////// ** ////////////// ** ///////////// ** ////////////// ** ///////////// ** //////////////
 */
/* Esquema de Datos de los Productos del Carrito de Usuario - Tienda Online - Nivel 2 */
let ShopCarSchema = new dataSchema({
  order: { type: Number, unique: true, require: true, alias: 'scodr'},
  id: { type: objectId, alias: 'scpid' },
  price: { type: Date, alias: 'scpce' },
  quantt: { type: Date, alias: 'scstk' },
  paidod: { type: Boolean, require: true, alias: 'scpdo' }
}, { id: false, _id: false });

/* Esquema de Datos del Usuario - Nivel 1 */
let UserSchema = new dataSchema({
  nameuser: { type: String, require: true, alias: 'usnme' },
  emailusr: { type: String, lowercase: true, trim: true, require: true, alias: 'useml' },
  pwordusr: { type: String, require: true, alias: 'uspwd' },
  shopcar: [ShopCarSchema]
});

let UserData = mongoose.model('Usuario', UserSchema);
module.exports = UserData;
