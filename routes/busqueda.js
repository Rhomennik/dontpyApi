var express = require('express');

var app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');
var Tarjeta = require('../models/tarjeta');
var Maquinas = require('../models/maquinas');
var Sucursals = require('../models/sucursal');
// ==============================
// Busqueda por colección
// ==============================
app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, 'i');

    var promesa;

    switch (tabla) {

        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;

        case 'medicos':
            promesa = buscarMedicos(busqueda, regex);
            break;

        case 'hospitales':
            promesa = buscarHospitales(busqueda, regex);
            break;

        case 'tarjetas':
            promesa = buscarTarjeta(busqueda, regex);
            break;
        case 'maq':
            promesa = buscarMaquinas(busqueda, regex);
            break;
        case 'sucursal':
            promesa = buscarSucursal(busqueda, regex);
            break;


        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda',
                error: { message: 'Tipo de tabla/coleccion no válido' }
            });

    }

    promesa.then(data => {

        res.status(200).json({
            ok: true,
            [tabla]: data
        });

    })

});


// ==============================
// Busqueda general
// ==============================
app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');


    Promise.all([
            buscarHospitales(busqueda, regex),
            buscarMedicos(busqueda, regex),
            buscarUsuarios(busqueda, regex),
            buscarTarjeta(busqueda, regex),
            buscarMaquinas(busqueda, regex),
            buscarSucursal(busqueda, regex)
        ])
        .then(respuestas => {

            res.status(200).json({
                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2],
                tarjeta: respuestas[3],
                maquinas: respuestas[4],
                sucursal: respuestas[5]
            });
        })


});

// ####### busquedas DE MAQUINAS

function buscarMaquinas(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Maquinas.find({}, '')
            .or([{ 'iplocal': regex }])
            .exec((err, maq) => {

                if (err) {
                    reject('Erro al cargar Tarjetas', err);
                } else {
                    resolve(maq);
                }


            })


    });
}


function buscarHospitales(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Hospital.find({ nombre: regex })
            .populate('usuario', 'nombre email img')
            .exec((err, hospitales) => {

                if (err) {
                    reject('Error al cargar hospitales', err);
                } else {
                    resolve(hospitales)
                }
            });
    });
}

function buscarMedicos(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Medico.find({ nombre: regex })
            .populate('usuario', 'nombre email img')
            .populate('hospital')
            .exec((err, medicos) => {

                if (err) {
                    reject('Error al cargar medicos', err);
                } else {
                    resolve(medicos)
                }
            });
    });
}

function buscarUsuarios(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre email role img')
            .or([{ 'nombre': regex }, { 'email': regex }, { 'role': regex }])
            .exec((err, usuarios) => {

                if (err) {
                    reject('Erro al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }


            })


    });
}

function buscarTarjeta(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Tarjeta.find({}, '')
            .or([{ 'cliente': regex }, { 'codigo': regex }])
            .exec((err, tarjeta) => {

                if (err) {
                    reject('Erro al cargar Tarjetas', err);
                } else {
                    resolve(tarjeta);
                }


            })


    });
}


function buscarSucursal(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Sucursals.find({}, '')
            .or([{ 'nombre': regex }, { 'vpn': regex }])
            .exec((err, Sucursals) => {

                if (err) {
                    reject('Erro al cargar Sucursal', err);
                } else {
                    resolve(Sucursals);
                }


            })


    });
}




module.exports = app;