var kenx=require("kenx");
var conexion= require("../config/conexion").conexion;
var bookshelf=require("bookshelf");
var baseDatos=bookshelf(kenx(conexion));
module.exports.baseDatos=baseDatos;