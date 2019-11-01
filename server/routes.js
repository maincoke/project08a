/**
 * Enrutador de funciones para los request y response de la Online Shop
 *
 * Importación de paquetes instalados para la funcionalidad de modulos GET Y POST
 */
const Router = require('express').Router(),
      sessionExp = require('express-session'),
      bcrypt = require('bcrypt'),
      mongoose = require('mongoose'),
      mongoSession = require('connect-mongo')(sessionExp),
      objectId = mongoose.Types.ObjectId,
      newuuid1 = require('uuid/v1'),
      { User } = require('./models.js'),
      { Product } = require('./models.js'),
      sessionStored = new mongoSession({ url: 'mongodb://localhost/onlineshop' }),
      BCRYPT_SALT_ROUNDS = 6;

// *** Función que busca y obtiene los datos de la sesión *** //
getSession = (sid) => {
return sessionStored.get(sid, (error, sessusr) => {
    if (error) throw error;
    return sessusr;
  });
}

// *** Función que elimina los datos de la sesión *** //
clearSession = (sid) => {
return sessionStored.destroy(sid, (error) => {
    if (error) throw error;
    return;
  });
}

// *** Función que actualiza en el Producto las unidades disponibles *** //
updStockProd = (idprod, newQtt) => {
  Product.updateOne({ _id: objectId(idprod) }, { $set: { stock: newQtt}}, (error, doc) => {
    if (error) {
      res.send({ msgerr: 'Hubo un error al actualizar las Unidades del producto!!'});
      console.error('===>>> Error en la actualización del Stock del producto: \n' + error);
    }
  });
}

// Verificación y regeneración de sesión del Usuario // ************************ Rutas Get/Post *************************************
Router.post('/', function(req, res) {
  console.log(req.body);
  this.getSession(req.body.sid).then(sessusr => {
    console.log(sessusr.id + ' -- ' + sessusr.sid);
  }).catch(error => {
    console.error('No existe la SESION....!!!');
  });
});

// *** Verificación de Login, acceso y configuración de Sesion del Usuario *** //
Router.post('/login', function(req, res) {
  let username = req.body.email,
      userpass = req.body.pword;
  User.findOne({ emailusr: username }).exec().then(doc => {
    bcrypt.compare(userpass, doc.pwordusr).then(validPword => {
      let result;
      if (!validPword) {
        result = { access: false, msg: 'Las credenciales no son válidas!! La contraseña no es correcta!!' };
      } else {
        req.session.regenerate(error => { if (error) throw console.error(error) });
        let sessusr = req.session;
        sessusr.username = username;
        sessusr.userId = doc._id;
        result = { access: true, id: doc._id, username: doc.emailusr, sid: req.sessionID };
      }
      res.send(result);
    }).catch(error => {
      console.error('===>>> Error en la sesión del usuario: \n' + error);
    });
  }).catch(error => {
    let wrong = { access: false, msg: 'Cuenta de usuario no se encuentra registrada!!' };
    res.send(wrong);
    console.error('===>>> Error en la autenticación del usuario: \n' + error);
  });
});

// *** Terminación de sesión y salida de la App Tienda Online *** //
Router.post('/logout', function(req, res) {
  this.getSession(req.body.sid).then(sessusr => {
    this.clearSession(req.body.sid).then(resolve => {
      if (resolve.error) { throw resolve.error; }
      res.send(true);
    }).catch(error => {
      console.error('===>>> Hubo un error en el cierre de la sessión!! \n' + error);
    });
  }).catch(error => {
    console.error('===>>> No existe la SESION..!! \n ' + error);
  });
});

// *** Inclusión de datos básicos del Usuario *** //
Router.post('/newuser', function(req, res) {
  let username = req.body.credsusr.email;
  let findmail = User.where({ emailusr: username });
  findmail.findOne((error, doc) => {
    if (error || !doc) {
      let pworduser = req.body.credsusr.pword;
      bcrypt.hash(pworduser, BCRYPT_SALT_ROUNDS).then(function(pwordHashed) {
        let newuser = new User({
          nameuser: req.body.namesusr,
          emailusr: req.body.credsusr.email,
          pwordusr: pwordHashed,
          shopcar: [{ order: newuuid1(), paidod: false }]
        });
        newuser.save().then(doc => {
          let result = { msgscs: "Usuario registrado con éxito!!" };
          res.send(result);
        }).catch(function(error) {
          let wrong = { msgerr: "Hubo un error en el registro de usuario!!" };
          res.send(wrong);
          console.error('===>>> Error en el registro de usuario: ');
        });
      }).catch(function(error) {
          let wrong = { msgerr: "Error: La contraseña no se logró generar con éxito!!" };
          res.send(wrong);
      });
    } else {
      let wrong = JSON.stringify({ msgerr: "La cuenta con la dirección de correo " + username + ",\n ya se encuentra registrada!!" });
      res.send(wrong);
    }
  });
});

// *** Inclusión de un nuevo producto al carrito de compras del usuario *** //
Router.post('/newprod', function(req, res) {
  this.getSession(req.body.sid).then(sessusr => {
    const product = req.body.prod;
    User.updateOne({ emailusr: sessusr.username, "shopcar.order": req.body.order, "shopcar.paidod": false },
      { "$push": { "shopcar.$.products": product }}, (error, doc) => {
      if (!error) {
        updStockProd(product.id, req.body.newstk);
        let success = { id: product.id, msgscs: "Producto agregado al carrito!!" };
        res.send(success);
      } else {
        let wrong = { msgerr: 'Hubo un error al agregar el producto!!' };
        res.send(wrong);
        console.error('===>>> Error en la inclusión del producto: \n' + error);
      }
    });
  }).catch(error => {
    let wrong = { msgerr: 'Cuenta de usuario no existe ó expiró la sessión!!' };
    res.send(wrong);
    console.error('===>>> Error en la autenticación del usuario: \n' + error);
  });
});

// *** Actualización de cantidad y precio de un producto en el Carrito del Usuario en la Tienda Online *** //
Router.post('/updateprod/:id', function(req, res) {
  this.getSession(req.body.sid).then(sessusr => {
    const setPrc = "shopcar.$.products." + req.body.idx.toString() + ".price";
    const setQtt = "shopcar.$.products." + req.body.idx.toString() + ".quantt";
    // const setStk =
    User.updateOne({ emailusr: sessusr.username, "shopcar.paidod": false, "shopcar.products.id": objectId(req.params.id) },
    { $set: { [setPrc]: req.body.price, [setQtt]: req.body.quantt } }, (error, doc) => {
      if (!error) {
        updStockProd(req.params.id, req.body.newstk);
        res.send({ msgscs: 'Cantidad y precio actualizados con éxito!!'});
      } else {
        res.send({ msgerr: 'Hubo un error al actualizar los datos del producto!!'});
        console.error('===>>> Error en la actualización del producto en el carrito: \n' + error);
      }
    });
  }).catch(error => {
    res.send({ msgerr: 'Cuenta de usuario no existe ó expiró la sessión!!' });
    console.error('===>>> Error en la autenticación del usuario: \n' + error);
  });
});

// *** Eliminación de un producto en el Carrito del Usuario en la Tienda Online *** //
Router.post('/deleteprod/:id', function(req, res) {
  this.getSession(req.body.sid).then(sessusr => {
    User.updateOne({ emailusr: sessusr.username, "shopcar.paidod": false, "shopcar.products.id": objectId(req.params.id) },
    { "$pull": { shopcar: { products: { $elementMatch: { id: req.params.id }}}}}, (error, doc) => {
      if (!error) {
         res.send({ msgscs: 'Producto sacado del carrito con éxito!!'});
         console.log(doc);
      } else {
        res.send({ msgerr: 'Hubo un error al borrar los datos del producto!!'});
        console.error('===>>> Error en la eliminación del producto en el carrito: \n' + error);
      }
    });
  }).catch(error => {
    res.send({ msgerr: 'Cuenta de usuario no existe ó expiró la sessión!!' });
    console.error('===>>> Error en la autenticación del usuario: \n' + error);
  });
});

// *** Obtención de todos los productos del Carrito del usuario la Tienda Online *** //
Router.post('/shopcar', function(req, res) {
  this.getSession(req.body.sid).then(sessusr => {
    User.findOne({ emailusr: sessusr.username, "shopcar.paidod": false }).exec().then(doc  => {
      let dataCar = { username: doc.emailusr, order: doc.shopcar[0].order, paidod: doc.shopcar[0].paidod };
      if (doc.shopcar[0].products.length != 0) {
        dataCar.shopcarProds =  doc.shopcar[0].products;
      } else {
        dataCar.shopcarProds =  new Array;
      }
      res.send(dataCar);
    }).catch(error  => {
      let wrong = { msgerr: 'Hubo un error en obtener los productos del carrito!!' };
      res.send(wrong);
      console.error('===>>> Error en la consulta del carrito:  \n' + error);
    });
  }).catch(error => {
    let wrong = { msgerr: 'Cuenta de usuario no existe ó expiró la sessión!!' };
    res.send(wrong);
    console.error('===>>> Error en la autenticación del usuario: \n' + error);
  });
});

// *** Obtención por parametro 'id' de un producto del Catalogo de la Tienda Online *** //
Router.post('/product/:id', function(req, res) {
  let prodId = objectId(req.params.id);
  this.getSession(req.body.sid).then(sessusr => {
    if (sessusr.error) throw sessusr.error
    Product.findById(prodId).exec().then(doc => {
      let prodData = doc;
      res.send(prodData);
    }).catch(error => {
      let wrong = { msgerr: 'Hubo un error en la obtención del producto: \n' + req.params.id };
      res.send(wrong);
      console.error('===>>> Error en la obtención del producto:  \n' + error);
    });
  }).catch(error => {
    let wrong = { msgerr: 'Cuenta de usuario no existe ó expiró la sessión!!' };
    res.send(wrong);
    console.error('===>>> Error en la autenticación del usuario: \n' + error);
  });
});

// *** Obtención de todos los productos del Catalogo de la Tienda Online *** //
Router.post('/catalog', function(req, res) {
  this.getSession(req.body.sid).then(sessusr => {
    if (sessusr.error) throw sessusr.error
    Product.find({ stock: { $ne : 0 }}).sort('name').exec().then(docs => {
      let prodsData = docs;
      res.send(prodsData);
    }).catch(error => {
      let wrong = { msgerr: 'Hubo un error en la obtención de productos!!' };
      res.send(wrong);
      console.error('===>>> Error en la obtención de productos:  \n' + error);
    });
  }).catch(error => {
    let wrong = { msgerr: 'Cuenta de usuario no existe ó expiró la sessión!!' };
    res.send(wrong);
    console.error('===>>> Error en la autenticación del usuario: \n' + error);
  });
});

module.exports = Router;
