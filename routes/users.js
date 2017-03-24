var express = require('express');
var router = express.Router();
var passport =require("passport");
var LocalStrategy=require("passport-local").Strategy;
var session =require("express-session");
var bcrypt =require("bcrypt-nodejs");
var UsuarioModel = require("../models/usuarios");
var bodyParser = require("body-parser");
var urlencondedParse= bodyParser.urlencoded({ extended:false});


router.post("/iniciarSesion", urlencondedParse,function(req,res,next){
  passport.authenticate('local',
  {
    
    successRedirect: "/bienvenido",
    failureRedirect: "/login"

  },
  function(err,usuario,info){
    console.log(err);
    if(err){
      return res.render("login",{title:"Express",error:err.message});
      
    }
    if(!usuario){
      return res.render("login",{title:"Express",error:"Usuario no valido"});
    }
    return req.logIn(usuario,function(err){
       if(err){
      return res.render("login",{title:"Express",error:err.message});
      
    }else{
      res.render('bienvenido',{title:'bienvenido', usuario:usuario});
    }

    });
  }
  )(req,res,next);
});

router.post("/cerrarSesion",function(req,res,next){
  
  
});

router.post("/signUp", function (req, res) {
  var usuario=req.body;
  var usuarioPromise = new UsuarioModel.usuarios({correo:usuario.correo}).fetch();
  return usuarioPromise.then(
    function (modelo) {
      if(modelo){
        res.render("index", {title:"Registrar usuario",error:"El usuario existe"});
      }else{
        usuario.clave =bcrypt.hashSync(usuario.clave);
        var modeloUsuario = new UsuarioModel.usuarios(
          {
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            correo: usuario.correo,
            clave: usuario.clave

          }
        );
        modeloUsuario.save().then(function (modelo) {
          res.render("index", {title:"registrar usuario",error: "El usuario fue creado"});
        })
      }
    }
  );
});

router.get('/auth/facebook',
  passport.authenticate('facebook')
);

router.get('/auth/facebook/callback',
  passport.authenticate('facebook',{failureRedirect:'/login'}),
  function(req,res){
    res.redirect("/bienvenido");
  });


module.exports = router;
