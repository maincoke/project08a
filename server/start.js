/**
 * Funcionalidad de Servidor Node.js
 *
 * Importacion de paquetes instalados para inicializar servidor Node.js
 */
const path = require('path'),
    Routing = require('./routes.js'),
    express = require('express'),
    session = require('express-session'),
    genuuid = require('uuid/v4'),
    levelSession = require('level-session-store')(session),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

/* Configuración de instancias y variables del Servidor */
const PORT = 3000;
const shop = express();
const urldb = 'mongodb://localhost/onlineshop';

/* Conexión con la BD MongoDB con el framework Mongoose */
mongoose.connect(urldb, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Hubo un error en la conexión con el MongoDB:\n'));
db.once('open', function() {
    console.log('Conexión con BD exitosa!!');
    console.log(new Date(Date.now()));
});

/* Uso de libreria para el manejo de sesion */
shop.use(session({
    genid: function(req) {
        return genuuid();
    },
    secret: 'Shop Evt',
    name: 'shopuser.id',
    resave: false,
    rolling: true,
    saveUninitialized: false,
    cookie: { maxAge: 1200000 },
    store: new levelSession('./user/session/shopper')
}));

/* Uso de instancia de servidor para configurar enrutador de funciones y contenido body-parser */
// shop.use(express.static('../client'));
shop.use(bodyParser.json());
shop.use(bodyParser.urlencoded({ extended: true }));
shop.use('/shopping', Routing);

/**
 * Inicio y puesta en marcha del Servidor
 */
shop.listen(PORT, function() {
    console.log('Server is up!! Running & listennig on port: ' + PORT);
});