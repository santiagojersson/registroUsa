var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Express' });
});
router.get('/bienvenido', function(req, res, next) {
  if(!req.isAuthenticated()){
    res.render('login', {title:'Express'})
  }else{
    var usuario = req.user;
    if(usuario!== undefined){
    usuario = req.user.toJSON();
    }
    res.render('bienvenido', { title: 'Express',usuario:usuario });
  }
  
});

module.exports = router;
