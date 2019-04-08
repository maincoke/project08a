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

getSession = (sid) => {
return sessionStored.get(sid, (error, sessusr) => {
    if (error) throw error;
    return sessusr;
  });
}

// Verificación y regeneración de sesión del Usuario // ***********************************************************
Router.post('/', function(req, res) {
  console.log(req.body);
  this.getSession(req.body.sid).then(sessusr => {
    console.log('Esta es la sessión: ====>> ' + sessusr.username);
    console.log(sessusr);
    // res.redirect('./catalog');
  }).catch(error => {
    console.log('No consigue la sesión....!!!');
    //res.redirect('/');
  });
  /*console.log(sessusr);
  console.log('Esta es la sessión: ====>> ' + sessusr.username);*/
  console.log('Final de consulta de Sesion ====////****');
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
        console.log(sessusr);
        sessusr.username = username;
        sessusr.userId = doc._id;
        result = { access: true, id: doc._id, username: doc.emailusr, sid: req.sessionID };
        console.log(result);
      }
      res.send(result);
    }).catch(error => {
      console.error('=>>>>Error en la sesión del usuario: \n' + error);
    });
  }).catch(error => {
    let wrong = { access: false, msg: 'Cuenta de usuario no se encuentra registrada!!' };
    res.send(wrong);
    console.error('=>>>>Error en la autenticación del usuario: \n' + error);
  });
});

// Terminación de sesisión y salida de la App Tienda Online // ******************************************************
Router.get('/logout', function(req, res) {
  req.session.destroy(function(error) {
    if (error) {
      console.log('=>>>>Hubo un error en el cierre de la sessión!!');
    } else {
      res.redirect('/');
    }
  });
});

// *** Inclusión de datos básicos del Usuario *** //
Router.post('/newuser', function(req, res) {
  console.log(req.body.credsusr.email);
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
          console.log('=>>>>Error en el registro de usuario: ');
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
Router.post('/newproduct', function(req, res) {
    let sessusr = req.session;
    if (sessusr.username) {
        User.findOne({ identusr: sessusr.userId }).exec().then(doc => {
            let product = req.body;
            //product.id = new objectId;
            doc.shopcar.push(product);
            doc.save().then((shpusr) => {
                let success = { id: product.name, msg: "Evento agendado con éxito!!" };
                res.send(success);
            }).catch(error => {
                let wrong = { msg: 'Hubo un error en el registro del evento!!' };
                res.send(wrong);
                console.log('Error en la inclusión del evento: ');
            });
        }).catch(error => {
            let wrong = { msg: 'Cuenta de usuario no existe ó expiró la sessión!!' };
            res.send(wrong);
            console.log('Error en la autenticación del usuario: ');
        });
    } else {
        res.status(400).send();
    }
});

// Eliminación de un producto en el Carrito del Usuario en la Tienda Online // ****************************************
Router.post('/deleteproduct/:id', function(req, res) {
    let sessusr = req.session;
    if (sessusr.username) {
        User.findOneAndUpdate({ _id: sessusr.userId }, { $pull: { products: { id: req.params._id } } }, (error, doc) => {
            if (!error) {
                let scheduleDoc = doc.schedule;
                let eventdel = scheduleDoc.findIndex(evt => evt.id == req.params.id);
                res.send("El evento:\n [ " + scheduleDoc[eventdel].title + " ],\nfue borrado con éxito!!");
            } else {
                res.send("Hubo un error al borrar el evento!!");
                console.log('Error en la eliminación del evento: ');
            }
        });
    } else {
        res.status(400).send();
    }
});

// Actualización de cantidad de un producto en el Carrito del Usuario en la Tienda Online // ***************************
Router.post('/update', function(req, res) {
    let sessusr = req.session;
    if (sessusr.username) {
        User.findOneAndUpdate({ identusr: sessusr.userId, "schedule.id": req.body.id }, { $set: { 'schedule.$.start': req.body.start, 'schedule.$.end': req.body.end } }, (error, doc) => {
            if (!error) {
                res.send("El evento fue reagendado y actualizado con éxito!!");
            } else {
                res.send("Hubo un error al actualizar el evento!!");
                console.log('Error en la actualización del evento: ');
            }
        });
    } else {
        res.status(400).send();
    }
});

// Obtención de todos los productos del Carrito del usuario la Tienda Online // ***************************************
Router.get('/shopcar', function(req, res) {
    let sessusr = req.session;
    if (sessusr.username) {
        User.findOne({ emailusr: sessusr.username }).exec().then(doc => {
            let datauser = { username: doc.emailusr, productos: doc.shopcar.paidod };
            res.send(datauser);
        }).catch(error => {
            let wrong = { msg: 'Cuenta de usuario no existe ó expiró la sessión!!' };
            res.send(wrong);
            console.log('Error en la autenticación del usuario: ');
        });
    } else {
        res.status(400).send();
    }
});

// *** Obtención de todos los productos del Catalogo de la Tienda Online *** //
Router.get('/catalog', function(req, res) {
  console.log('=========================/////====================');
  // console.log(sessusr);
  if (sessusr.username) {
    Product.find().exec().then(docs => {
      let prodsData = docs;
      res.send(prodsData);
    }).catch(error => {
      let wrong = { msg: 'Hubo un error en la recuperación de productos!!' };
      res.send(wrong);
      console.log('===>> Error en la obtención de productos:  \n' + error);
    });
  } else {
    let wrong = { msg: 'Cuenta de usuario no existe ó expiró la sessión!!' };
    res.status(400).send();
    console.log('===>> Error en la autenticación del usuario!!');
  }
});

module.exports = Router;
