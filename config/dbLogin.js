var knex= require("knex");
var conexion = require("../config/conexion").conexion;
var bookshelf =require("bookshelf");
var baseDatos =bookshelf(knex(conexion));
module.exports.baseDatos =baseDatos;