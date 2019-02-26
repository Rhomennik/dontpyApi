var express = require('express');
var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();


app.get('/', [mdAutenticacion.verificaToken], (req, res, next) => {

    res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamente'
    });

});

module.exports = app;