var baseDatos = require("../config/dbLogin").baseDatos;

var usuarios = baseDatos.Model.extend(
    {
        tableName: 'usuarios_tb',
        idSttribute: 'codUsuario'
    }
);
module.exports ={usuarios:usuarios};
