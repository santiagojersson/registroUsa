var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//librerias passport

var passport=require("passport");
var LocalStrategy = require("passport-local").Strategy;
var FacebookStrategy = require("passport-facebook").Strategy;
var session = require("express-session");
var bcrypt = require("bcrypt-nodejs");
var usuarioModel=require("./models/usuarios");
var User = require("./models/user");

//mongoose
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://admin:admin@ds141450.mlab.com:41450/usadb");

//configuracion passport  
passport.use(new LocalStrategy(
  function(correo,clave,done){
    new usuarioModel.usuarios(
  {correo:correo}).fetch().then(
   function(info){
     var usuarioInfo=info;
     if(usuarioInfo==null){
       return done(null,false,{mensaje:'email no valido'});
     }else{
       usuarioInfo=usuarioInfo.toJSON();;
       if(!bcrypt.compareSync(clave,usuarioInfo.clave)){
         return done(null,false,{mensaje:'clave no valida'});
       }else{
         return done(null,usuarioInfo);
       }
     }
   }
  );    
  }
));

passport.use(
  new FacebookStrategy(
    {
      clientID: '1857260484532632',
      clientSecret: 'f1a33247fd48b8fec9f74d7ad0a09dac',
      callbackURL: "https://registrousa2.herokuapp.com/auth/facebook/callback",
      profileFields: ["email","displayName"]
    },
    function(token, refreshToken, profile,done){
      process.nextTick(function(){
        User.findOne(
          {'facebook.id':profile.id},
          function(err,user){
            if(err){
              return done(err);
            }
            if(user){
              return done(null,user);
            }else{
              var newUser = new User();
              newUser.facebook.id = profile.id;
              newUser.facebook.token = token;
              newUser.facebook.name = profile.displayName;
              newUser.facebook.email = profile.id;
              newUser.save(function(err){
                if(err){
                    throw err;
                }
                return done(null,newUser);
              });
            }
          }
        );
      });
      console.log(profile);
    }
  )
);

passport.serializeUser(
  function(usuario,done){
    done(null,usuario);
  }
);

passport.deserializeUser(function(id,done){
  User.findById(id,function(err,user){
    done(err,user);
  });
},
   function(usuario,done){
    new usuarioModel.usuarios({usuario:usuario}).fetch().then(
     function(usuario){
       done(null,usuario);
     }
    );
  }
)

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({secret:"Es una frase",cookie:{maxAge:60000},resave:true,saveUninitialized:true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
